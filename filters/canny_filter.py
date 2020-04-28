import cv2
from . import image_filter

class CannyFilter(image_filter.ImageFilter):
    def __init__(self, kernel_size_x=75, kernel_size_y=75, *args, **kwargs):
        image_filter.ImageFilter.__init__(self, *args, **kwargs)
        self.kx, self.ky = kernel_size_x, kernel_size_y

    def process_frame(self, frame):
        return cv2.Canny(frame, self.kx, self.ky)
