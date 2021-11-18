# Three.LS

![image](https://user-images.githubusercontent.com/1810902/141849317-4e6547c1-4afa-4e9b-bcd8-71d5707f18a2.png)

IT even (kinda) runs on an Apple Watch :)

![141848972-b3483d27-ca3e-46b6-af02-9a5c83efec1b](https://user-images.githubusercontent.com/1810902/141849203-d0e1b49c-2bf9-4c97-87d8-3478a84b783b.jpg)

On smartphones:
![image](https://user-images.githubusercontent.com/1810902/141849847-e466adab-5a88-4975-ab94-3974326f5334.png)


## Info

3D L-Systems with Three.js

We used Three.js to create trees and other plant-like structures using Lindenmayer Systems. A code of rulesets can be used and iterated upon to create all kinds of "growing" structures. 

## Contributors

- [Nick Häcker](https://github.com/NickHaecker)
- [Marc Eberhard](https://github.com/bymarcx)
- [Bastian Hodapp](https://github.com/Bassadin)
- [Lukas Brausch](https://github.com/LukasBrauschHFU)
- [Manuel Proß](https://github.com/manuel-pross)

## AR version

Web XR supported AR version coming soon! (Hopefully.)

## GitHub Pages Version

Online auto-deploy version available here: <https://bassadin.github.io/Three.LS>

# Development

Clone the project and install dependencies:

```bash
npm i
npm start
```

## Local WebXR testing

-   Install mkcert: <https://github.com/FiloSottile/mkcert>
-   Obtain a local certificate: `mkcert -install && mkcert -key-file snowpack.key -cert-file snowpack.crt localhost`
-   Run `npm run start-secure`
-   Go to <https://localhost:8080/ar.html>

-   An online demo is also available at <https://bassadin.github.io/Three.LS/ar.html> for supported devices
