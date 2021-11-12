# Three.LS

![2021-07-01 09_35_44-MIB5 DaVerMePro Three js stuff](https://user-images.githubusercontent.com/1810902/124086653-90b63b00-da51-11eb-8aab-8ea717240a2e.jpg)

## Info

3D L-Systems with Three.js

This was a rather small university project we did in our fifth semester. The task was to do some kind of automatic processing of 3D model data and we decided to do something with Lindenmayer Systems.

## Development

Clone the project and install dependencies:

```bash
npm i
npm start
```

## GitHub Pages Version

Online auto-deploy version available here: <https://bassadin.github.io/Three.LS>

## Local WebXR testing

-   Install mkcert: <https://github.com/FiloSottile/mkcert>
-   Obtain a local certificate: `mkcert -install && mkcert -key-file snowpack.key -cert-file snowpack.crt localhost`
-   Run `npm run start-secure`
-   Go to <https://localhost:8080/ar.html>

-   An online demo is also available at <https://bassadin.github.io/Three.LS/ar.html> for supported devices
