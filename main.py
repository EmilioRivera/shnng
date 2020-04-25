import os, fcntl
import abc
import cv2
import numpy as np

from v4l2 import *


class ImageFilter(object):
    @abc.abstractmethod
    def process_frame(self, frame):
        pass

class CannyFilter(ImageFilter):
    def process_frame(self, frame):
        return cv2.Canny(frame, 75, 75)

class StyleTransferFilter(ImageFilter):
    def process_frame(self, frame):
        pass


current_filter = CannyFilter()

def handle_key(key):
    global current_filter
    if key == -1:
        return
    elif key == 48:  # 0
        current_filter = None
    elif key == 49:  # 1
        current_filter = CannyFilter() if not isinstance(current_filter, CannyFilter) else current_filter
    else:
        print(f'Key {key} not supported')


def transform_frame(frame):
    global current_filter
    return current_filter.process_frame(frame) if current_filter is not None else frame


def configure_video_options(capture_device, width, height):
    return
    success = capture_device.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    success = success and capture_device.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    if not success:
        raise Exception('Failed to set correct width and height')

WIDTH = 640
HEIGHT = 480

# Input device
cv2.namedWindow("Input image")
cam_device = '/dev/video2'
vc = cv2.VideoCapture(cam_device)
configure_video_options(vc, WIDTH, HEIGHT)

# Filter output
cv2.namedWindow("Filter result")

# Virtual webcam
virtual_loopback_write_device_name = '/dev/video4'
virtual_loopback_read_device_name = '/dev/video5'

class VirtualWebcamWriter(object):
    def __init__(self, device_name: str, width: int = 640, height: int = 512):
        self.width = width
        self.height = height

        if not os.path.exists(device_name):
            print("Warning: device '{}' does not exist".format(device_name))
        self.device = open(device_name, 'wb', 0)

        print(self.device)
        capability = v4l2_capability()
        print("get capabilities result", (fcntl.ioctl(self.device, VIDIOC_QUERYCAP, capability)))
        print("capabilities", hex(capability.capabilities))

        fmt = V4L2_PIX_FMT_UYVY

        print("v4l2 driver: ", capability.driver)
        format = v4l2_format()
        format.type = V4L2_BUF_TYPE_VIDEO_OUTPUT
        format.fmt.pix.pixelformat = fmt
        format.fmt.pix.width = self.width
        format.fmt.pix.height = self.height
        format.fmt.pix.field = V4L2_FIELD_NONE
        format.fmt.pix.bytesperline = self.width * 2
        format.fmt.pix.sizeimage = self.width * self.height * 2
        format.fmt.pix.colorspace = V4L2_COLORSPACE_SRGB

        print("set format result", (fcntl.ioctl(self.device, VIDIOC_S_FMT, format)))

    def write(self, array: np.array):
        self.device.write(self._convert_array_to_buffer(array))

    def _convert_array_to_buffer(self, array):
        def image_to_UYVY(image):
            imsize = image.shape[0] * image.shape[1] * 2
            buff = np.zeros((imsize), dtype=np.uint8)
            if len(image.shape) == 2 or image.shape[2] == 1:
                # Black and white
                col_img = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
                img = cv2.cvtColor(col_img, cv2.COLOR_BGR2YUV)
            else:
                img = cv2.cvtColor(image, cv2.COLOR_BGR2YUV)
            print(img.shape)
            
            y, u, v = cv2.split(img)
            uv = np.zeros_like(y)
            rows, cols = y.shape

            # Transformation into the UYVY
            out = np.zeros(y.size+uv.size, dtype=np.uint8)
            out[0::4] = cv2.resize(u, (cols // 2, rows), interpolation=cv2.INTER_LINEAR).ravel()
            out[1::2] = y.ravel()
            out[2::4] = cv2.resize(v, (cols // 2, rows), interpolation=cv2.INTER_LINEAR).ravel()
            return out

        return image_to_UYVY(array)

    def destroy(self):
        if self.device is not None:
            self.device.close()


ENABLE_VIRTUAL_WRITER = True
ENABLE_VIRTUAL_READER = False

# Writer
virtual_writer = None
if ENABLE_VIRTUAL_WRITER:
    virtual_writer = VirtualWebcamWriter(virtual_loopback_write_device_name, WIDTH, HEIGHT)


# Virtual webcam reader
if ENABLE_VIRTUAL_READER:
    virtual_reader = cv2.VideoCapture(virtual_loopback_read_device_name)
    virtual_window_output = 'Virtual device output'
    cv2.namedWindow(virtual_window_output)


if vc.isOpened(): # try to get the first frame
    rval, frame = vc.read()
else:
    rval = False

while rval:
    rval, frame = vc.read()

    if ENABLE_VIRTUAL_READER:
        vwebam_rval, vwebcam_frame = virtual_reader.read()
        if vwebam_rval == -1:
            print('Could not read from virtualwebcam')

    new_frame = transform_frame(frame)

    cv2.imshow("Input image", frame)
    cv2.imshow("Filter result", new_frame)
    
    if ENABLE_VIRTUAL_READER:
        cv2.imshow(virtual_window_output, vwebcam_frame)
    
    if ENABLE_VIRTUAL_WRITER:
        virtual_writer.write(new_frame)


    key = cv2.waitKey(20)
    if key == 27:  # ESC key
        break
    handle_key(key)

cv2.destroyWindow("Filter result")
cv2.destroyWindow("Input image")
if ENABLE_VIRTUAL_WRITER:
    virtual_writer.destroy()
if ENABLE_VIRTUAL_READER:
    cv2.destroyWindow(virtual_window_output)
    virtual_reader.release()
vc.release()