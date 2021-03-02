from Constants import *
import cv2

def cvtToGray(source, colorMode):
    if colorMode == GRAYSCALE:
        return source
    elif colorMode == RGB:
        return cv2.cvtColor(source, cv2.COLOR_RGB2GRAY)
    elif colorMode == BGR:
        return cv2.cvtColor(source, cv2.COLOR_BGR2GRAY)
    else:
        raise ValueError("Unrecognized color mode")




        
