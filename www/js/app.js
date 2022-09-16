var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent();
    },
    receivedEvent: function () {
        document.getElementById("play").addEventListener("click", function () { this.onPlay(); }.bind(this), false );
        document.getElementById("flip").addEventListener("click", function () { this.onFlip(); }.bind(this), false );
        document.getElementById("switch").addEventListener("click", function () { this.onSwitch(); }.bind(this), false );
        document.getElementById("stop").addEventListener("click", function () { this.onStop(); }.bind(this), false );
        document.getElementById("torch").addEventListener("click", function () { this.onTorch(); }.bind(this), false );

        if (!window.plugin.CanvasCamera) return;
        window.plugin.CanvasCamera.initialize({
            fullsize: window.document.getElementById("fullsize"),
            thumbnail: window.document.getElementById("thumbnail"),
        });
    },
    onPlay: function () {
        if (window.plugin.CanvasCamera) {
            var options = {
                canvas: {
                    width: 320,
                    height: 240,
                },
                capture: {
                    width: 320,
                    height: 240,
                },
                use: "data",
                fps: 30,
                flashMode: this.flash,
                hasThumbnail: true,
                thumbnailRatio: 1 / 6,
                cameraFacing: this.position,
            };
            window.plugin.CanvasCamera.start(
                options,
                function (error) {
                    console.log("[CanvasCamera start]", "error", JSON.stringify(error));
                },
                function (data) {
                    console.log(JSON.stringify(data));
                }
            );
        }
    },

    flip: {},
    onFlip: function () {
        if (window.plugin.CanvasCamera) {
            var self = this;
            if (self.flip.flipped) {
                self.flip.scaleH = 1;
                self.flip.scaleV = 1;
                self.flip.flipped = false;
            } else {
                self.flip.scaleH = -1;
                self.flip.scaleV = -1;
                self.flip.flipped = true;
            }

            if (!self.flip.listener) {
                self.flip.listener = true;
                window.plugin.CanvasCamera.beforeFrameRendering(function (
                    event,
                    frame
                ) {
                    this.context.save();
                    frame.dWidth = frame.dWidth * self.flip.scaleH;
                    frame.dHeight = frame.dHeight * self.flip.scaleV;
                    this.context.scale(self.flip.scaleH, self.flip.scaleV);
                    console.log(self.flip.scaleH, self.flip.scaleV);
                });
                window.plugin.CanvasCamera.afterFrameRendering(function (event, frame) {
                    this.context.restore();
                });
            }
        }
    },

    flash: false,
    onTorch: function () {
        if (window.plugin.CanvasCamera) {
            this.flash = this.flash ? false : true;
            window.plugin.CanvasCamera.flashMode(
                this.flash,
                function (error) {
                    console.log("[CanvasCamera flashMode]", "error", error);
                },
                function (data) {
                    console.log("[CanvasCamera flashMode]", "data", data);
                }
            );
        }
    },

    position: "back",
    onSwitch: function () {
        if (window.plugin.CanvasCamera) {
            this.position = this.position === "front" ? "back" : "front";
            window.plugin.CanvasCamera.cameraPosition(
                this.position,
                function (error) {
                    console.log("[CanvasCamera cameraPosition]", error);
                },
                function (data) {
                    console.log("[CanvasCamera cameraPosition]", "data", data);
                }
            );
        }
    },

    onStop: function () {
        if (window.plugin.CanvasCamera) {
            window.plugin.CanvasCamera.stop(
                function (error) {
                    console.log("[CanvasCamera stop]", "error", error);
                },
                function (data) {
                    console.log("[CanvasCamera stop]", "data", data);
                }
            );
        }
    },
};

app.initialize();