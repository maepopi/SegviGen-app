"""segvigen._postprocess — Post-processing operations on exported GLB meshes.

Not part of the public API; import from the top-level package instead.
"""

from __future__ import annotations

import copy
import os
import tempfile
from pathlib import Path
from typing import Union

import pymeshlab
import trimesh


def remesh_triangles(
    mesh: Union[trimesh.Trimesh, trimesh.Scene, str, Path],
    target_faces: int,
    preserve_texture: bool = True,
    preserve_boundary: bool = True,
    preserve_normals: bool = True,
    quality_threshold: float = 0.3,
) -> trimesh.Trimesh:
    """Decimate a textured triangle mesh to a target face count."""
    if isinstance(mesh, (str, Path)):
        mesh = trimesh.load(str(mesh), force="scene", process=False)
    if isinstance(mesh, trimesh.Scene):
        geoms = [g for g in mesh.geometry.values()
                 if isinstance(g, trimesh.Trimesh) and len(g.faces) > 0]
        if not geoms:
            raise ValueError("No valid Trimesh geometries found in input.")
        mesh = geoms[0] if len(geoms) == 1 else trimesh.util.concatenate(geoms)

    original_visual = mesh.visual

    with tempfile.TemporaryDirectory() as tmpdir:
        in_path = os.path.join(tmpdir, "mesh_in.obj")
        out_path = os.path.join(tmpdir, "mesh_out.obj")

        mesh.export(in_path)

        ms = pymeshlab.MeshSet()
        ms.load_new_mesh(in_path)
        ms.apply_filter("meshing_remove_duplicate_vertices")
        ms.apply_filter("meshing_remove_duplicate_faces")
        ms.apply_filter("meshing_repair_non_manifold_edges")
        ms.apply_filter("meshing_repair_non_manifold_vertices")
        ms.apply_filter(
            "meshing_decimation_quadric_edge_collapse",
            targetfacenum=target_faces,
            preservetexcoord=preserve_texture,
            preserveboundary=preserve_boundary,
            preservenormal=preserve_normals,
            qualitythr=quality_threshold,
            autoclean=True,
        )
        ms.save_current_mesh(out_path)

        result = trimesh.load(out_path, force="mesh", process=False)
        if isinstance(result, trimesh.Scene):
            result = result.dump(concatenate=True)

    # OBJ round-trip loses metallic/roughness/alpha — restore original PBR material.
    # preservetexcoord=True keeps UV addressing the same atlas regions.
    if (preserve_texture
            and hasattr(original_visual, "uv") and original_visual.uv is not None
            and hasattr(original_visual, "material")
            and hasattr(result.visual, "uv") and result.visual.uv is not None):
        material = copy.copy(original_visual.material)
        material.doubleSided = False
        result.visual = trimesh.visual.TextureVisuals(uv=result.visual.uv, material=material)

    return result
