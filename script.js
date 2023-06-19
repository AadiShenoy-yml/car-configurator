var version = "1.12.1";
var uid = "b8567c30ba2e4148930e573d76aeef44"; //b8567c30ba2e4148930e573d76aeef44
var iframe = document.getElementById("api-frame");
var client = new window.Sketchfab(version, iframe);
var canvas = document.createElement("canvas");

var ctx = canvas.getContext("2d");
canvas.width = 2;
canvas.height = 2;
var myMaterials;
var annotation = false;
var partsVisible = true;
var metal = false;

var getColorAsTextureURL = function getColorAsTextureURL(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 2, 2);
  return canvas.toDataURL("image/png", 1.0);
};

var blackTextureURL = getColorAsTextureURL("black");

var blackTextureUID;

var error = function error() {
  console.error("Sketchfab API error");
};

var success = function success(api) {
  api.start(function () {
    api.addEventListener("viewerready", function () {
      var textures = [];
      api.setPostProcessing({ enable: true, blur: 0 });

      api.addTexture(blackTextureURL, function (err, textureId) {
        blackTextureUID = textureId;
      });

      api.getSceneGraph(function (err, result) {
        if (err) {
          console.log("Error getting nodes");
          return;
        }
        // get the id from that log
        console.log(JSON.stringify(result));
      });

      for (let i = 0; i < 4; i++) {
        api.hideAnnotation(i, function (err, index) {
          if (!err) {
            window.console.log("Hiding annotation", index + 1);
          }
        });
      }

      //show and hide parts
      var id = 1032;
      document.getElementById("hide").addEventListener("click", function () {
        if (partsVisible) {
          api.hide(id);
          partsVisible = false;
          document.getElementById("hide").innerHTML = "Show Part";
        } else {
          api.show(id);
          partsVisible = true;
          document.getElementById("hide").innerHTML = "Hide Part";
        }
      });

      api.getMaterialList(function (err, materials) {
        myMaterials = materials;
        for (var i = 0; i < myMaterials.length; i++) {
          var m = myMaterials[i];
          textures[m.name] = m.channels.AlbedoPBR.texture;
          // console.log(m.name, m);
        }
      });
      let isOpen = false


      //rotate function
      // document.getElementById("rotate").addEventListener("click", function () {
      //   const angle = isOpen ? 0 : 90;
      //   api.rotate(
      //     3,
      //     [angle, 1, 0, 0],
      //     {
      //       duration: 1.0,
      //       easing: "easeOutQuad",
      //     },
      //     function (err, rotateTo) {
      //       if (!err) {
      //         isOpen = !isOpen
      //       }
      //     }
      //   );
      // });

      //show and hide annotations
      document
        .getElementById("annotation")
        .addEventListener("click", function () {
          if (annotation) {
            for (let i = 0; i < 4; i++) {
              api.hideAnnotation(i, function (err, index) {
                if (!err) {
                  window.console.log("Hiding annotation", index + 1);
                }
              });
            }
            annotation = false;
            document.getElementById("annotation").innerHTML = "Show Annotation";
          } else {
            for (let j = 0; j < 4; j++) {
              api.showAnnotation(j, function (err, index) {
                if (!err) {
                  window.console.log("Showing annotation", index + 1);
                }
              });
            }
            annotation = true;
            document.getElementById("annotation").innerHTML = "Hide Annotation";
          }
        });

      //change background color
      document
        .getElementById("background-color")
        .addEventListener("click", function () {
          var randBgR = Math.random();
          var randBgG = Math.random();
          var randBgB = Math.random();
          var randBgA = Math.random();
          api.setBackground(
            {
              color: [randBgR, randBgG, randBgB, randBgA],
            },
            function () {}
          );
        });

      //change background image
      document
        .getElementById("background-image")
        .addEventListener("click", function () {
          // use ?api_log=1 in editor to get those values
          var list = [
            "ac8475e46ec94c169ab5774bb1287624",
            "78fa317e46024a5283765aa34df5e508",
            "3ef1bd11d3eb4b57a0b353e8f2e5fc3e",
          ];
          console.log(list);
          var randBg = Math.floor(Math.random() * Math.floor(list.length));
          api.setBackground(
            {
              uid: list[randBg],
            },
            function () {}
          );
        });

      //change backgound environment
      document
        .getElementById("environment")
        .addEventListener("click", function () {
          // use ?api_log=1 in editor to get those values
          var list = [
            "2a016b232e444ef3a6ba323c51aa5063",
            "41192cc664484a0fa565da3361d10c9c",
          ];
          var randEnv = Math.floor(Math.random() * Math.floor(list.length));
          api.setBackground({
            enable: "environment",
          });
          api.setEnvironment(
            {
              enabled: true,
              uid: list[randEnv],
            },
            function () {}
          );
        });

      //change car color
      document.getElementById("texture").addEventListener("click", function () {
        var randBgR = Math.random();
        var randBgG = Math.random();
        var randBgB = Math.random();
        var randBgA = Math.random();
        var array = [
          "red",
          "body",
          "top",
          "grooves",
          "handle",
          "hedlamp_border",
          "bump_mat",
          "carpaint_metalic_blue",
          "forMayaAOlambert17",
        ];
        for (var i = 0; i < myMaterials.length; i++) {
          var m = myMaterials[i];
          m.channels.AlbedoPBR.enable = true;
          m.channels.MetalnessPBR.enable = true;

          if (array.some((str) => m.name.includes(str))) {
            m.channels.AlbedoPBR.texture = false;
            m.channels.AlbedoPBR.color = [randBgR, randBgG, randBgB, randBgA];
            api.setMaterial(m);
          }
        }
      });

      //Add metal
      document.getElementById("metal").addEventListener("click", function () {
        if (metal) {
          for (var i = 0; i < myMaterials.length; i++) {
            var m = myMaterials[i];
            m.channels.MetalnessPBR.enable = false;
            api.setMaterial(m);
          }
          metal = false;
          document.getElementById("metal").innerHTML = "Add Metal";
        } else {
          for (var i = 0; i < myMaterials.length; i++) {
            var m = myMaterials[i];
            m.channels.MetalnessPBR.enable = true;
            api.setMaterial(m);
          }
          metal = true;
          document.getElementById("metal").innerHTML = "Remove Metal";
        }
      });

      //audi car
      // document.getElementById("audi").addEventListener("click", function () {
      //   uid = "954b66c92f5f489fb4cfbac80477a15b";

      //   client.init(uid, {
      //     success: success,
      //     error: error,
      //     autostart: 1,
      //     transparent: 1,
      //     preload: 0,
      //     ui_stop: 0, //disables the close icon
      //   });
      // });

      //alfa-romeo car
      // document
      //   .getElementById("alfa-romeo")
      //   .addEventListener("click", function () {
      //     uid = "3c9640d8030847b789f58ffbe1fba6fe";

      //     client.init(uid, {
      //       success: success,
      //       error: error,
      //       autostart: 1,
      //       transparent: 1,
      //       preload: 0,
      //       ui_stop: 0, //disables the close icon
      //     });
      //   });

    });
  });
};

client.init(uid, {
  success: success,
  error: error,
  autostart: 1,
  transparent: 1,
  preload: 0,
  ui_stop: 0, //disables the close icon
  dof_circle: 0,
  // autospin:1
});

// GUI Code
