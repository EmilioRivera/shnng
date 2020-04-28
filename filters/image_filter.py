import abc

class ImageFilter(object):
    @abc.abstractmethod
    def process_frame(self, frame):
        pass

    def unregister(self):
        pass
