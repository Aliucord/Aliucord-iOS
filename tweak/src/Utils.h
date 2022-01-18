BOOL downloadFile(NSString *source, NSString *dest);
BOOL checkFileExists(NSString *path);

void alert(NSString *message);
void confirm(NSString *title, NSString *message, void (^confirmed)(void));