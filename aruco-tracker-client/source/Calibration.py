import tkinter
import cv2
import PIL.Image, PIL.ImageTk
import time
from Utilities import cvtToGray
from Constants import *
import json
import numpy as np

# Based on: https://solarianprogrammer.com/2018/04/21/python-opencv-show-video-tkinter-window/

class CalibrationWizard:
    def __init__(self, video_source=0, colorMode=RGB, doneCallback=None):
        self.window = tkinter.Tk()
        self.window.title("Calibration Wizard")
        self.video_source = video_source
        self.colorMode = colorMode
        self.charucoCorners = []
        self.charucoIds = []
        self.doneCallback = doneCallback

        self.dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
        self.board = cv2.aruco.CharucoBoard_create(8,11,.22,.161,self.dictionary)

        # open video source (by default this will try to open the computer webcam)
        self.vid = VideoCapture(self.video_source)

        # Create a canvas that can fit the above video source size
        self.canvas = tkinter.Canvas(self.window, width = self.vid.width, height = self.vid.height)
        self.canvas.pack()

        self.frame = tkinter.Frame(self.window, height=10)
        self.frame.pack()

        # Button that lets the user take a snapshot
        self.btn_snapshot=tkinter.Button(self.frame, text="Capture", width=50, command=self.snapshot)
        self.btn_snapshot.pack(anchor=tkinter.S, expand=True)

        # Button that finishes calibration
        self.btn_done=tkinter.Button(self.frame, text="Calibrate", width=50, command=self.calibrate, state=tkinter.DISABLED)
        self.btn_done.pack(anchor=tkinter.S, expand=True)

        # After it is called once, the update method will be automatically called every delay milliseconds
        self.delay = 15
        self.update()

        self.window.mainloop()

    def snapshot(self):
        # Get a frame from the video source
        frame = self.vid.lastSuccessfulFrame
        if not frame is None:
            gray = cvtToGray(frame, self.colorMode)
            corners, ids, rejectedImgPoints = cv2.aruco.detectMarkers(gray, self.dictionary)
            if not ids is None:
                retval, charucoCorners, charucoIds = cv2.aruco.interpolateCornersCharuco(corners, ids, gray, self.board)
                if retval:
                    self.charucoCorners.append(charucoCorners)
                    self.charucoIds.append(charucoIds)
        if (len(self.charucoIds)>0):
            self.btn_done.config(state=tkinter.NORMAL)

    def calibrate(self):
        retVal, cameraMatrix, distCoeffs, rvecs, tvecs = cv2.aruco.calibrateCameraCharuco(self.charucoCorners, self.charucoIds, self.board, self.vid.lastSuccessfulFrame.shape[:2],None,None)
        if not self.doneCallback is None:
            self.doneCallback(retVal, cameraMatrix, distCoeffs, rvecs, tvecs)
            self.window.destroy()
        else:
            print(cameraMatrix, distCoeffs)

    def update(self):
        # Get a frame from the video source
        ret, frame = self.vid.get_frame()
        frame = cvtToGray(frame, self.colorMode)
        if ret:
            self.photo = PIL.ImageTk.PhotoImage(image = PIL.Image.fromarray(frame))
            self.canvas.create_image(0, 0, image = self.photo, anchor = tkinter.NW)

        self.window.after(self.delay, self.update)

class VideoCapture:
    def __init__(self, video_source=0):
        # Open the video source
        self.vid = cv2.VideoCapture(video_source)
        if not self.vid.isOpened():
            raise ValueError("Unable to open video source", video_source)

        # Get video source width and height
        self.width = self.vid.get(cv2.CAP_PROP_FRAME_WIDTH)
        self.height = self.vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
        self.lastSuccessfulFrame = None

    def get_frame(self):
        if self.vid.isOpened():
            ret, frame = self.vid.read()
            if ret:
                # Return a boolean success flag and the current frame converted to BGR
                self.lastSuccessfulFrame = frame
                return (ret, frame)
            else:
                return (ret, None)
        else:
            return (ret, None)

    # Release the video source when the object is destroyed
    def __del__(self):
        if self.vid.isOpened():
            self.vid.release()

class Config(object):
    def __init__(self):
        self.capDev = None
        self.cameraMatrix = None
        self.distCoeffs = None
        self.colorMode = None
        self.arucoDictArg = None
    def load(self, path:str):
        with open(path) as file:
            configDict = json.load(file)
        self.capDev = configDict["capDev"]
        self.cameraMatrix = np.array(configDict["cameraMatrix"])
        self.distCoeffs = np.array(configDict["distCoeffs"])
        self.colorMode = configDict["colorMode"]
        self.arucoDictArg = configDict["arucoDictArg"]
        self.markerLength = configDict["markerLength"]
        return self
    def save(self, path:str):
        configDict = {
            "capDev": self.capDev,
            "cameraMatrix": self.cameraMatrix.tolist(),
            "distCoeffs": self.distCoeffs.tolist(),
            "colorMode": self.colorMode,
            "arucoDictArg": self.arucoDictArg,
            "markerLength": self.markerLength
        }
        with open(path, "w") as file:
            json.dump(configDict, file)
        return self
    def validate(self):
        raise NotImplementedError
        # check if capture device actually exists
        # check if capture device would actually support color mode
    def wizard(self):
        self.capDev = int(input("Capture device id:"))
        self.colorMode = int(input("Color mode enum integer:"))
        self.arucoDictArg = int(input("Aruco dictionary enum integer:"))
        self.markerLength = float(input("Marker length:"))
        CalibrationWizard(self.capDev, self.colorMode, self.__setCalibration)
        return self
    def __setCalibration(self, retVal, cameraMatrix, distCoeffs, rvecs, tvecs):
        self.cameraMatrix = cameraMatrix
        self.distCoeffs = distCoeffs

# Create a window and pass it to the Application object