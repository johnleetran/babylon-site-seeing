import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Vector3 } from 'babylonjs';

module GAME{
    export class Game{

        private _canvas: HTMLCanvasElement;
		private _engine: BABYLON.Engine;
        private _scene: BABYLON.Scene;
        private _camera: BABYLON.FollowCamera;

        private _duck!: BABYLON.AbstractMesh;
        private _shoe!: BABYLON.AbstractMesh;

        constructor(){
            var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
            var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
            var scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 1.0);
            this._engine = engine;
            this._canvas = canvas;
            this._scene = scene;

            this._camera = this.initCamera();

            // Add lights to the scene
            this.initLights();

            // Add and manipulate meshes in the scene
            //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, this._scene);
            
            // helper lines to show axis
            this.showAxis();
            
            //register resize event
            this.initWindowsResizeEvent();

            //init key presses event
            this.initKeyPressEvent();

            //init gltf modles
            this.initModels();

            //debug
            this._scene.debugLayer.show();

        }

        private initModels(){
            this.initDuck();
            this.initShoe();
        }

        private initDuck(){
            let alpha = 0.0;
            let orbit_radius = 20;
            BABYLON.SceneLoader.LoadAssetContainer("./", "duck.glb", this._scene, (container) => {
                let meshes = container.meshes;
                for (let m of meshes) {
                    m.scaling = new BABYLON.Vector3(.1, .1, .1);
                    let mesh = m;
                
                    container.addAllToScene();
                    this._scene.registerBeforeRender( () => {
                        alpha += 0.01;
                        mesh.position.x = orbit_radius * Math.cos(alpha);
                        mesh.position.y = orbit_radius * Math.sin(alpha);
                        mesh.position.z = 10 * Math.sin(2 * alpha);
                        this._camera.rotationOffset = (18 * alpha) % 360;
                    });
                    this._duck = mesh;
                }
            });
        }

        private initShoe() {
            let alpha = 0.0;
            let orbit_radius = 20;
            BABYLON.SceneLoader.LoadAssetContainer("./", "shoe.glb", this._scene, (container) => {
                
                //var mesh = BABYLON.Mesh.MergeMeshes(container.meshes as BABYLON.Mesh[]);
                //container.addAllToScene();
                container.instantiateModelsToScene(name => "p" + name, true )
                let mesh = this._scene.getMeshByName("p__root__");
                if(mesh){
                    mesh.position = new BABYLON.Vector3(0, 10, 0);
                    this._shoe = mesh as BABYLON.Mesh;
                    this._scene.registerBeforeRender(() => {
                        alpha += 0.01;
                        this._shoe.position.x = orbit_radius * Math.cos(alpha);
                        this._shoe.position.y = orbit_radius * Math.sin(alpha);
                        this._shoe.position.z = 10 * Math.sin(2 * alpha);
                        this._camera.rotationOffset = (18 * alpha) % 360;
                    });
                    this._shoe = mesh;
                }

            });
        }

        private initKeyPressEvent(){
            let scene = this._scene;
            scene.onKeyboardObservable.add((evt) => {
                switch (evt.type) {
                    case BABYLON.KeyboardEventTypes.KEYDOWN:          
        
                        switch (evt.event.key) {
                            case "a": // passt
                            case "A":
                                console.log('a');
                                break;                        
                            case "d": // passt
                            case "D":
                                console.log('d');
                                this._camera.lockedTarget = this._duck;
                                break;
                            case "s": // passt
                            case "S":
                                console.log('s');
                                this._camera.lockedTarget = this._shoe;
                                break
                            case "w": // passt
                            case "W":
                                console.log('w');
                                break;
                         };
                        break;
                };
            });
        }

        private randomInt(min: number, max: number){
            return Math.floor(Math.random() * (max - min) ) + min;
        }

        private randomFloatUnderOnePositiveOrNegative(){
            var tmp = this.randomInt(0,2)
            var sign = 1;
            if(tmp === 1) {
                sign = -1
            }
            return this.randomFloatUnderOne() * sign;
        }

        private randomFloatUnderOne(){
            return Math.random();
        }


        private initCamera(){
            // This creates a basic Babylon Scene object (non-mesh)
            let scene = this._scene;
            /********** FOLLOW CAMERA EXAMPLE **************************/

            // This creates and initially positions a follow camera 	
            //var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
            var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

            //The goal distance of camera from target
            camera.radius = 30;

            // The goal height of camera above local origin (centre) of target
            camera.heightOffset = 10;

            // The goal rotation of camera around local origin (centre) of target in x y plane
            camera.rotationOffset = 0;

            //Acceleration of camera in moving from current to goal position
            camera.cameraAcceleration = 0.005

            //The speed at which acceleration is halted 
            camera.maxCameraSpeed = 10

            //camera.target is set after the target's creation

            // This attaches the camera to the canvas
            camera.attachControl(this._canvas, true);

            // // Add a camera to the scene and attach it to the canvas
            // var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -50), this._scene);
            // //var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), this._scene);
            // camera.attachControl(this._canvas, true);
            return camera;
        }

        private initLights(){
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this._scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), this._scene);
        }

        private initWindowsResizeEvent(){
            // Watch for browser/canvas resize events
            window.addEventListener("resize", () => {
                this._engine.resize();
            });
        }

        private showAxis(){
            //Array of points to construct lines
            var xAxisPoints = [
                new BABYLON.Vector3(1000, 0, 0),
                new BABYLON.Vector3(-1000, 0, 0),
            ];
            var yAxisPoints = [
                new BABYLON.Vector3(0, 1000, 0),
                new BABYLON.Vector3(0, -1000, 0),
            ];            
            var zAxisPoints = [
                new BABYLON.Vector3(0, 0, 1000),
                new BABYLON.Vector3(0, 0, -1000),
            ];

            //Create lines 
            var red = new BABYLON.Color3(1,0,0);
            var green = new BABYLON.Color3(0,1,0);
            var blue = new BABYLON.Color3(0,0,1);

            var xLines = BABYLON.MeshBuilder.CreateLines("xAxis", {points: xAxisPoints}, this._scene); 
            var yLines = BABYLON.MeshBuilder.CreateLines("yAxis", {points: yAxisPoints}, this._scene); 
            var zLines = BABYLON.MeshBuilder.CreateLines("zAxis", {points: zAxisPoints}, this._scene); 
            xLines.color = red;
            yLines.color = green;
            zLines.color = blue;
        }
        public runRenderLoop(){
            this._engine.runRenderLoop( () => {
                this._scene.render();
            });
        }
    }
}
function runGame() {
    let game = new GAME.Game();
    game.runRenderLoop();
}

runGame();




