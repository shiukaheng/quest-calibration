# MultiQuest
<img src="https://i.imgur.com/PgiklaT.jpeg" width="100" height="100">
MultiQuest is an extendible framework used for creating multiplayer arena-scale experiences with the Oculus Quest, which currently does not support such experiences natively. It uses external cameras and ARUCO markers to allow different headsets to synchrnoize their coordinate spaces.

This project is currently a work in progress.

## Todo
- [ ] Software design
- [ ] Main server - communicates between clients and cameras and calibrate 
- [ ] Tracker client - spots headsets
- [ ] WebXR client - allows calibration on WebXR powered experiences
- [ ] Hand-eye calibration - compensate for difference between marker and device origin
## Maybe
- [ ] Multi-marker support
- [ ] Extend support for native Oculus Quest experiences
- [ ] Extend support for different headsets / AR devices
