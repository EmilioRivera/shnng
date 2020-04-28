import os, fcntl
import abc
import numpy as np

import cv2
import v4l2


class ImageFilter(object):
    @abc.abstractmethod
    def process_frame(self, frame):
        pass

    def unregister(self):
        pass

class CannyFilter(ImageFilter):
    def process_frame(self, frame):
        return cv2.Canny(frame, 75, 75)

class StyleTransferFilter(ImageFilter):
    def process_frame(self, frame):
        pass

class CartoonGan(ImageFilter):
    def __init__(self, gpu=False, style='Hayao', model_path='./pretrained_model'):
        import torch
        import os
        import numpy as np
        # from PIL import Image
        import torchvision.utils as vutils
        from network.Transformer import Transformer
        self.gpu = gpu
        self.model = Transformer()
        print(self.model)
        self.model_path = model_path
        self.model.load_state_dict(torch.load(os.path.join(self.model_path, style + '_net_G_float.pth')))
        self.current_style = style
        self.model.eval()
        if gpu:
            self.model.cuda()
        # TODO: Check what the load_size is
        self.load_size = 500  # Default value as taken from the repo

        # TODO: Check for optimizations
        # self.image_tensor = Variable()

    def unregister(self):
        del self.model

    def change_style(self, style):
        if self.current_style == style:
            return
        import torch
        self.model.load_state_dict(torch.load(os.path.join(self.model_path, style + '_net_G_float.pth')))
        return self

    def preprocess_frame(self, frame):
        import torch
        from torch.autograd import Variable
        import torchvision.transforms as transforms
        h, w = frame.shape[0], frame.shape[1]
        ratio = h * 1.0 / w
        if ratio > 1:
            h = self.load_size
            w = int(h*1.0/ratio)
        else:
            w = self.load_size
            h = int(w * ratio)
        # TODO: Check if we need to cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        resized = cv2.resize(frame, (h, w))
        # print(resized.dtype)
        resized = resized[:,:,::-1]
        image_tensor = -1 + 2 * resized.astype(np.float32)
        # print(image_tensor.dtype)
        with torch.no_grad():
            image_tensor = transforms.ToTensor()(image_tensor).unsqueeze(0)
            if self.gpu:
                image_tensor = torch.Tensor(image_tensor).cuda()
            else:
                image_tensor = torch.Tensor(image_tensor).float()
            return image_tensor

    def process_frame(self, frame):
        from PIL import Image
        import torchvision.transforms as transforms
        preprocessed = self.preprocess_frame(frame)
        output = self.model(preprocessed)
        output = output.data.cpu().float() * 0.5 + 0.5
        # a = transforms.ToPILImage()(output.squeeze())
        # print(a.size)
        # return a
        # print(type(output), output.shape)
        arr = np.moveaxis(output.numpy().squeeze(), 0, -1)
        # print(arr.shape, arr.dtype, arr.min(), arr.max())
        return cv2.resize(arr[:,:,::-1], (WIDTH, HEIGHT))



current_filter = CannyFilter()
cnn_style_ix = 0
CNN_STYLES = ['Hayao', 'Hosoda', 'Paprika', 'Shinkai']
_current_key = None

def handle_key(key):
    if key == -1:
        return

    global current_filter, cnn_style_ix, _current_key, CNN_STYLES
    if _current_key is not None and _current_key != key:
        print('Unregistering because current key is {} and key is {}'.format(_current_key, key))
        if current_filter is not None:
            current_filter.unregister()

    # Copy _current_key in case it's not handled
    old_key = _current_key
    _current_key = key

    if key == 48:  # 0
        current_filter = None
    elif key == 49:  # 1
        current_filter = CannyFilter() if not isinstance(current_filter, CannyFilter) else current_filter
    elif key == 50:  # 2
        if isinstance(current_filter, CartoonGan):
            cnn_style_ix += 1
            new_style = CNN_STYLES[cnn_style_ix % len(CNN_STYLES)]
            print('Switching style to', new_style)
            current_filter.change_style(new_style)
        else:
            current_filter = CartoonGan(gpu=True)
    else:
        # Revert back _current_key
        _current_key = old_key
        print(f'Key {key} not supported')


def transform_frame(frame):
    global current_filter
    return current_filter.process_frame(frame) if current_filter is not None else frame


def configure_video_options(capture_device, width, height):
    success = capture_device.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    success = success and capture_device.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    if not success:
        raise Exception('Failed to set correct width and height')

WIDTH = 1920
HEIGHT = 1080

# Input device
cv2.namedWindow("Input image")
cam_device = '/dev/video0'
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