"""segvigen._postprocess — Post-processing operations on exported GLB meshes.

Not part of the public API; import from the top-level package instead.
"""

from __future__ import annotations

import copy
import os
import tempfile
import warnings
from pathlib import Path
from typing import Union

import numpy as np
import pymeshlab
import trimesh


def remesh_triangles(
    mesh: Union[trimesh.Trimesh, trimesh.Scene, str, Path],
    decimation_target: int = 100_000,
    preserve_texture: bool = True,
) -> trimesh.Trimesh:
    """Isotropic remesh a textured triangle mesh targeting approximately decimation_target faces."""

    def remesh_single(m: trimesh.Trimesh) -> trimesh.Trimesh:
        original_visual = m.visual

        with tempfile.TemporaryDirectory() as tmpdir:
            in_path = os.path.join(tmpdir, "mesh_in.obj")
            out_path = os.path.join(tmpdir, "mesh_out.obj")

            m.export(in_path)

            ms = pymeshlab.MeshSet()
            ms.load_new_mesh(in_path)

            geom = ms.get_geometric_measures()
            surface_area = geom["surface_area"]

            # Compute bounding box diagonal manually
            verts = ms.current_mesh().vertex_matrix()
            bbox_min = verts.min(axis=0)
            bbox_max = verts.max(axis=0)
            bbox_diag = float(np.linalg.norm(bbox_max - bbox_min))

            target_len_abs = (4.0 * surface_area / (3**0.5 * decimation_target)) ** 0.5
            target_len_pct = 100.0 * target_len_abs / bbox_diag

            # Pre-cleanup: remove degenerate geometry
            ms.apply_filter("meshing_remove_duplicate_vertices")
            ms.apply_filter("meshing_remove_duplicate_faces")
            ms.apply_filter("meshing_repair_non_manifold_edges")
            ms.apply_filter("meshing_repair_non_manifold_vertices")
            
            ms.apply_filter(
                "meshing_isotropic_explicit_remeshing",
                targetlen=pymeshlab.PercentageValue(target_len_pct),
                iterations=3,
                adaptive=False,
                featuredeg=30.0,
                checksurfdist=True,
                maxsurfdist=pymeshlab.PercentageValue(1.0),
            )

            ms.save_current_mesh(out_path)

            result = trimesh.load(out_path, force="mesh", process=False)
            if isinstance(result, trimesh.Scene):
                result = result.dump(concatenate=True)

        had_texture = (hasattr(original_visual, "uv") and original_visual.uv is not None
                       and hasattr(original_visual, "material"))
        result_has_uv = hasattr(result.visual, "uv") and result.visual.uv is not None
        if preserve_texture and had_texture and result_has_uv:
            material = copy.copy(original_visual.material)
            result.visual = trimesh.visual.TextureVisuals(uv=result.visual.uv, material=material)
        elif preserve_texture and had_texture and not result_has_uv:
            warnings.warn(
                "remesh_triangles: texture preservation requested but UVs were lost during "
                "the OBJ round-trip (likely due to degenerate geometry). "
                "The returned mesh has no material.",
                UserWarning,
                stacklevel=3,
            )

        return result

    if isinstance(mesh, (str, Path)):
        mesh = trimesh.load(str(mesh), force="scene", process=False)

    if isinstance(mesh, trimesh.Scene):
        geoms = [g for g in mesh.geometry.values()
                 if isinstance(g, trimesh.Trimesh) and len(g.faces) > 0]
        if not geoms:
            raise ValueError("No valid Trimesh geometries found in input.")
        if len(geoms) == 1:
            return remesh_single(geoms[0])
        return trimesh.util.concatenate([remesh_single(g) for g in geoms])

    return remesh_single(mesh)
