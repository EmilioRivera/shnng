import os
import numpy as np
import cv2

from . import image_filter


# TODO: Remove this
WIDTH, HEIGHT = 1920, 1080

class CartoonGan(image_filter.ImageFilter):
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
        self.load_size = 400  # Default value as taken from the repo

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
