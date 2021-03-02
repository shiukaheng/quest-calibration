from Calibration import Config
from Trackers import Tracker

config = Config().load("config.json")
# print(config)
tracker = Tracker(config, showImage=True)
tracker.start()