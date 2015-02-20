/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false)
    window.addEventListener('orientationchange', function(){ window.setTimeout( app.orientationChange, 300 )  } )
    window.addEventListener('deviceorientation', app.updateOrientation )

  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },

  orientationChange: function() {
    if( window.orientation == 0 ){
      app.betaAxis = 'x'
      app.gammaAxis = 'y'
      app.betaAxisInversion = -1
      app.gammaAxisInversion = -1
    }else{
      app.betaAxis = 'y'
      app.gammaAxis = 'x'   
      app.betaAxisInversion = window.orientation / Math.abs(window.orientation) * -1
      app.gammaAxisInversion = window.orientation / Math.abs(window.orientation)
    }
    var w = window.innerWidth * window.devicePixelRatio
    var h = window.innerHeight * window.devicePixelRatio
    app.renderer.setSize( w, h )
    app.camera.aspect = w/h
    app.camera.updateProjectionMatrix()
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    app.deviceAlpha = null;
    app.deviceGamma = null;
    app.deviceBeta = null;
    app.betaAxis = 'x'
    app.gammaAxis = 'y'
    app.betaAxisInversion = -1
    app.gammaAxisInversion = -1
    
    document.body.style.zoom = 1 / window.devicePixelRatio
    var w = window.innerWidth * window.devicePixelRatio
    var h = window.innerHeight * window.devicePixelRatio

    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000 )
    app.renderer = new THREE.WebGLRenderer({antialias: true});
    app.renderer.setSize( w,h );
    document.body.appendChild( app.renderer.domElement );
    var geometry = new THREE.BufferGeometry().fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) )
    var material = new THREE.MeshLambertMaterial( { color: 'blue', ambient: 'blue' })
    app.cube = new THREE.Mesh( geometry, material )
    app.scene.add( new THREE.AmbientLight( 0x555555 ) )
    var light = new THREE.DirectionalLight( 0xffffff, 1 )
    light.position.z = 3
    light.position.y = 1
    app.scene.add( light )
    app.scene.add( app.cube )
    app.camera.position.z = 3
    app.frames = 0
    app.renderLoop(0)
  },

  updateOrientation: function(orientation){
    app.deviceAlpha = orientation.alpha;
    app.deviceGamma = orientation.gamma;
    app.deviceBeta = orientation.beta; 
  },

  updateCube: function() {
    app.cube.rotation[app.betaAxis] = app.deviceBeta * (Math.PI/180) * app.betaAxisInversion
    app.cube.rotation[app.gammaAxis] = app.deviceGamma * (Math.PI/180) * app.gammaAxisInversion
  },

  updateFps: function(t) {
    if( app.frames == 0 ){
      app.lasttime = t
    }
    app.frames++
    var diff = t - app.lasttime
    if( diff > 1000 ){
      var fps = Math.floor( app.frames/(diff/100000) ) / 100
      document.getElementById('fps').innerText = "fps: " + fps
      app.frames = 0
    }
  },

  renderLoop: function(t) {
    requestAnimationFrame( app.renderLoop )
    app.updateCube()
    app.updateFps(t)
    app.renderer.render( app.scene, app.camera )
  }
};

app.initialize();