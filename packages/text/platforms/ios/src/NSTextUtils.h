@interface NSTextUtils : NSObject
+(NSMutableAttributedString*)createNativeAttributedString:(NSDictionary*)data;
+(NSMutableAttributedString*)createNativeHTMLAttributedString:(NSDictionary*)data;
@end
