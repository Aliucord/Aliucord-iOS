ARCHS := arm64 arm64e
TARGET := iphone:clang:latest:7.0

include $(THEOS)/makefiles/common.mk

TWEAK_NAME = Aliucord
$(TWEAK_NAME)_FILES = src/Tweak.x src/Utils.x
$(TWEAK_NAME)_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/tweak.mk
