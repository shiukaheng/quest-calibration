from Calibration import Config
from Constants import *
import cv2

def sendData(data):
    print(data)

class Tracker(object):
    def __init__(self, config:Config, showImage:bool=False):
        self.config = config
        self.needLoop = False
        self.captureStream = None
        self.showImage = showImage
        self.arucoDict = cv2.aruco.Dictionary_get(self.config.arucoDictArg) # Can this be moved outside the loop for better efficiency?
        self.detectorParameters = cv2.aruco.DetectorParameters_create() # ??? Why does this take no parameters and need to be created in the loop
    def start(self):

        self.needLoop = True
        self.captureStream = cv2.VideoCapture(self.config.capDev)

        while (self.captureStream.isOpened() and self.needLoop):
            ret, frame = self.captureStream.read()
            if ret == True: # If image is fetched correctly

                if (self.config.colorMode==GRAYSCALE):
                    grayframe = frame
                elif (self.config.colorMode==RGB):
                    grayframe = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
                elif (self.config.colorMode==BGR):
                    grayframe = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                else:
                    raise ValueError("Unrecognized color mode")

                corners, ids, rejectedImgPoints = cv2.aruco.detectMarkers(grayframe, self.arucoDict, parameters=self.detectorParameters, cameraMatrix=self.config.cameraMatrix, distCoeff=self.config.distCoeffs)

                markers = {}
                if not ids is None:
                    for markerIndex in range(len(ids)):
                        rvec, tvec, _objPoints = cv2.aruco.estimatePoseSingleMarkers(corners[markerIndex], self.config.markerLength, self.config.cameraMatrix, self.config.distCoeffs)
                        markers[ids[markerIndex][0]] = {}
                        markers[ids[markerIndex][0]]["rvec"] = rvec.tolist()
                        markers[ids[markerIndex][0]]["tvec"] = tvec.tolist()

                sendData(markers)

                if (self.showImage):
                    debugFrame = cv2.aruco.drawDetectedMarkers(grayframe, corners, ids)
                    cv2.imshow("Marker detector visualization", debugFrame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break        

    def stop():
        self.needLoop = False




