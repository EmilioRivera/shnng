
import os, fcntl
import numpy as np
import cv2
import v4l2


class VirtualWebcamWriter(object):
    def __init__(self, device_name: str, width: int = 640, height: int = 512):
        self.width = width
        self.height = height

        if not os.path.exists(device_name):
            print("Warning: device '{}' does not exist".format(device_name))
        self.device = open(device_name, 'wb', 0)

        print(self.device)
        capability = v4l2.v4l2_capability()
        print("get capabilities result", (fcntl.ioctl(self.device, v4l2.VIDIOC_QUERYCAP, capability)))
        print("capabilities", hex(capability.capabilities))

        fmt = v4l2.V4L2_PIX_FMT_UYVY

        print("v4l2 driver: ", capability.driver)
        format = v4l2.v4l2_format()
        format.type = v4l2.V4L2_BUF_TYPE_VIDEO_OUTPUT
        format.fmt.pix.pixelformat = fmt
        format.fmt.pix.width = self.width
        format.fmt.pix.height = self.height
        format.fmt.pix.field = v4l2.V4L2_FIELD_NONE
        format.fmt.pix.bytesperline = self.width * 2
        format.fmt.pix.sizeimage = self.width * self.height * 2
        format.fmt.pix.colorspace = v4l2.V4L2_COLORSPACE_SRGB

        print("set format result", (fcntl.ioctl(self.device, v4l2.VIDIOC_S_FMT, format)))

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
