import { Canvas } from "@react-three/fiber";

export default function Scene() {
    return (
        <Canvas
            className="fixed inset-0 -z-50"
            camera={{
                position: [0, 0, 8],
                fov: 45,
            }}
            dpr={[1, 2]}
            gl={{
                antialias: true,
                alpha: false,
            }}
        >
            <color attach="background" args={["#030406"]} />
        </Canvas>
    );
}