import cv2
from . import image_filter

class CannyFilter(image_filter.ImageFilter):
    def process_frame(self, frame):
        return cv2.Canny(frame, 75, 75)
