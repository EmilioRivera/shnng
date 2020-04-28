import abc

class ImageFilter(object):
    def __init__(self, dimensions=None, *args, **kwargs):
        self.dimensions = dimensions

    @abc.abstractmethod
    def process_frame(self, frame, desired_dimensions=(-1, -1)):
        pass

    def unregister(self):
        pass
