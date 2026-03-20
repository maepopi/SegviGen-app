import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, DirectionalLight, Vector3, Color4, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { fileUrl } from '../api/client';
import { Download } from 'lucide-react';
import { downloadFile } from '../api/client';
export function Viewer3D({ label, filePath, downloadName }) {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    // Init engine & scene once
    useEffect(() => {
        const canvas = canvasRef.current;
        const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0.047, 0.055, 0.086, 1);
        const camera = new ArcRotateCamera('cam', -Math.PI / 2, Math.PI / 3, 3, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 0.05;
        camera.wheelPrecision = 50;
        camera.minZ = 0.01;
        const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
        hemi.intensity = 1.1;
        const dir = new DirectionalLight('dir', new Vector3(-1, -1.5, -0.5), scene);
        dir.intensity = 0.5;
        engine.runRenderLoop(() => scene.render());
        const onResize = () => engine.resize();
        window.addEventListener('resize', onResize);
        engineRef.current = engine;
        sceneRef.current = scene;
        return () => {
            window.removeEventListener('resize', onResize);
            engine.dispose();
        };
    }, []);
    // Load model whenever filePath changes
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene || !filePath)
            return;
        const prevMeshes = scene.meshes.slice();
        prevMeshes.forEach(m => m.dispose());
        const url = fileUrl(filePath);
        SceneLoader.ImportMeshAsync('', url, '', scene).then(({ meshes }) => {
            const visible = meshes.filter(m => m.getTotalVertices() > 0);
            if (!visible.length)
                return;
            // Auto-frame camera
            const cam = scene.cameras[0];
            let minX = Infinity, minY = Infinity, minZ = Infinity;
            let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
            visible.forEach(m => {
                const bi = m.getBoundingInfo();
                const mn = bi.boundingBox.minimumWorld;
                const mx = bi.boundingBox.maximumWorld;
                minX = Math.min(minX, mn.x);
                minY = Math.min(minY, mn.y);
                minZ = Math.min(minZ, mn.z);
                maxX = Math.max(maxX, mx.x);
                maxY = Math.max(maxY, mx.y);
                maxZ = Math.max(maxZ, mx.z);
            });
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const cz = (minZ + maxZ) / 2;
            const size = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
            cam.target = new Vector3(cx, cy, cz);
            cam.radius = size * 1.6;
        }).catch(console.error);
    }, [filePath]);
    return (_jsxs("div", { className: "flex flex-col bg-card rounded-xl border border-border overflow-hidden h-full", children: [_jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted", children: label }), filePath && downloadName && (_jsxs("button", { onClick: () => downloadFile(filePath, downloadName), className: "flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors", children: [_jsx(Download, { size: 12 }), " Download"] }))] }), _jsx("canvas", { ref: canvasRef, className: "w-full flex-1 touch-none", style: { minHeight: '320px', background: '#0c0e16' } })] }));
}
