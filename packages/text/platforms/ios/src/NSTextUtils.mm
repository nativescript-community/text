#import "NSTextUtils.h"
#import <CoreText/CoreText.h>

@implementation NSTextUtils
CGFloat computeBaseLineOffset(NSString *align, CGFloat fontAscent, CGFloat fontDescent, CGFloat fontBottom, CGFloat fontTop, CGFloat fontSize, CGFloat maxFontSize) {
  CGFloat result = 0;
  if ([align isEqualToString:@"top"]) {
    result = -maxFontSize - fontBottom - fontTop;
  } else if ([align isEqualToString:@"bottom"]) {
    result = fontBottom;
  } else if ([align isEqualToString:@"text-top"]) {
    result = -maxFontSize - fontDescent - fontAscent;
  } else if ([align isEqualToString:@"text-bottom"]) {
    result = fontBottom - fontDescent;
  } else if ([align isEqualToString:@"middle"] || [align isEqualToString:@"center"]) {
    result = (fontAscent - fontDescent) / 2 - fontAscent - maxFontSize / 2;
  } else if ([align isEqualToString:@"super"]) {
    result = -(maxFontSize - fontSize);
  } else if ([align isEqualToString:@"sub"]) {
    result = 0;
  }
  return result;
}

+(NSMutableAttributedString*)createNativeHTMLAttributedString:(NSDictionary*)data {
  //    if (!attributedString) {
  //        NSData* data = [nsString dataUsingEncoding: NSUnicodeStringEncoding allowLossyConversion: YES];
  //        attributedString = [[NSMutableAttributedString alloc] initWithHTML:data
  //    }
  NSString* htmlString = [data objectForKey:@"htmlString"];
  NSDictionary *dic = @{NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType,
                        NSCharacterEncodingDocumentOption: @(NSUTF8StringEncoding)};
  NSMutableAttributedString* attrText = [[NSMutableAttributedString alloc] initWithData:[htmlString dataUsingEncoding:NSUnicodeStringEncoding] options:dic documentAttributes:nil error:nil];
  
  NSRange fullRange = NSMakeRange(0, [attrText length]);
  UIColor* linkColor = [data objectForKey:@"linkColor"];
  NSNumber* useCustomLinkTag = [data objectForKey:@"useCustomLinkTag"];
  if (linkColor || [useCustomLinkTag boolValue]) {
    // if linkColor is used for non UITextView we cant use NSLinkAttributeName
    // as it will force the rendered color
    [attrText enumerateAttribute:NSLinkAttributeName inRange:fullRange options:0 usingBlock:^(id  _Nullable value, NSRange range, BOOL * _Nonnull stop) {
      if (value) {
        NSMutableDictionary* attributes = [[NSMutableDictionary alloc] initWithDictionary:[attrText attributesAtIndex:range.location longestEffectiveRange:nil inRange:range ]];
        NSString* sValue = nil;
        if ([value isKindOfClass:[NSURL class]]) {
          sValue = [(NSURL*)value absoluteString];
        } else {
          sValue = value;
        }
        if ([sValue hasPrefix:@"applewebdata://"]) {
          NSRange range = [sValue rangeOfString:@"/" options:NSBackwardsSearch];
          [attributes setObject:[sValue  substringFromIndex:range.location+1] forKey:@"CustomLinkAttribute"];
          
        } else {
          [attributes setObject:sValue forKey:@"CustomLinkAttribute"];
        }
        [attributes removeObjectForKey:NSLinkAttributeName];
        [attrText setAttributes:attributes range:range];
      }
    }];
  }
  // }
  NSNumber* autoFontSizeEnabled = [data objectForKey:@"autoFontSizeEnabled"];
  if ([autoFontSizeEnabled boolValue]) {
    [attrText enumerateAttribute:NSFontAttributeName inRange:fullRange options:0 usingBlock:^(UIFont*  _Nullable value, NSRange range, BOOL * _Nonnull stop) {
      if (value) {
        [attrText addAttribute:@"OriginalFontSize" value:[NSNumber numberWithFloat:[value pointSize]] range:range];
      }
    }];
  }
  
  NSNumber* letterSpacing = [data objectForKey:@"letterSpacing"];
  NSNumber* fontSize = [data objectForKey:@"fontSize"];
  if (letterSpacing && letterSpacing.floatValue != 0) {
    [attrText addAttribute:NSKernAttributeName value:[NSNumber numberWithFloat:letterSpacing.floatValue * fontSize.floatValue] range:fullRange];
  }
  __block NSMutableParagraphStyle* paragraphStyle = nil;
  NSNumber* textAlignment = [data objectForKey:@"textAlignment"];
  void (^createParagraphStyle)(void) = ^{
    if (!paragraphStyle) {
      paragraphStyle = [[NSMutableParagraphStyle alloc] init];
      if (textAlignment) {
        paragraphStyle.alignment = (NSTextAlignment)textAlignment.integerValue;
        
      }
    }
  };
  if (textAlignment) {
    createParagraphStyle();
  }
  NSNumber* lineBreak = [data objectForKey:@"lineBreak"];
  if (lineBreak) {
    
    createParagraphStyle();
    // make sure a possible previously set line break mode is not lost when line height is specified
    paragraphStyle.lineBreakMode = (NSLineBreakMode)lineBreak.integerValue;
  }
  NSNumber* lineHeight = [data objectForKey:@"lineHeight"];
  if (lineHeight) {
    createParagraphStyle();
    CGFloat fLineHeight =  [lineHeight floatValue];
    if (fLineHeight == 0.0) {
      fLineHeight = 0.00001;
    }
    paragraphStyle.minimumLineHeight = fLineHeight;
    paragraphStyle.maximumLineHeight = fLineHeight;
    // make sure a possible previously set text alignment setting is not lost when line height is specified
    // if (this.nativeTextViewProtected instanceof UILabel) {
    //     paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
    // }
  }
  if (paragraphStyle) {
    [attrText addAttribute:NSParagraphStyleAttributeName value:paragraphStyle range:fullRange];
  }
  return attrText;
}

+(NSMutableAttributedString*)createNativeAttributedString:(NSDictionary*)data {
  NSMutableAttributedString* result = [[NSMutableAttributedString alloc] init];
  for (id spanDetails in [data objectForKey:@"details"]){
    NSMutableDictionary* attributes = [[NSMutableDictionary alloc] init];
    UIFont* iosFont = [spanDetails objectForKey:@"iosFont"];
    if (iosFont) {
      [attributes setObject:iosFont forKey:NSFontAttributeName];
    }
    NSNumber* autoFontSizeEnabled = [spanDetails objectForKey:@"autoFontSizeEnabled"];
    if ([autoFontSizeEnabled boolValue]) {
      [attributes setObject:[spanDetails objectForKey:@"realFontSize"] forKey:@"OriginalFontSize"];
      
    }
    NSString* verticalTextAlignment = [spanDetails objectForKey:@"verticalTextAlignment"];
    if (verticalTextAlignment && iosFont && ![verticalTextAlignment isEqualToString:@"initial"] && ![verticalTextAlignment isEqualToString:@"stretch"]) {
      NSNumber* fontSize = [spanDetails objectForKey:@"fontSize"];
      CTFontRef ctFont = (__bridge CTFontRef)iosFont;
      CGFloat ascent = CTFontGetAscent(ctFont);
      CGFloat descent = CTFontGetDescent(ctFont);
      NSNumber* realMaxFontSize = [spanDetails objectForKey:@"realMaxFontSize"];
      [attributes setObject:[NSNumber numberWithFloat:-computeBaseLineOffset(verticalTextAlignment, -ascent, descent, -iosFont.descender, -iosFont.ascender, [fontSize floatValue], [realMaxFontSize floatValue])] forKey:NSBaselineOffsetAttributeName];
    }
    UIColor* color = [spanDetails objectForKey:@"color"];
    if (color) {
      [attributes setObject:color forKey:NSForegroundColorAttributeName];
      
    }
    UIColor* backgroundColor = [spanDetails objectForKey:@"backgroundColor"];
    if (backgroundColor) {
      [attributes setObject:backgroundColor forKey:NSBackgroundColorAttributeName];
    }
    NSNumber* letterSpacing = [spanDetails objectForKey:@"letterSpacing"];
    if (iosFont && letterSpacing) {
      [attributes setObject:[NSNumber numberWithFloat:(letterSpacing.floatValue * iosFont.pointSize)] forKey:NSKernAttributeName];
    }
    
    NSNumber* tapIndex = [spanDetails objectForKey:@"tapIndex"];
    if (tapIndex) {
      [attributes setObject:tapIndex forKey:@"CustomLinkAttribute"];
    }
    NSNumber* lineHeight = [spanDetails objectForKey:@"lineHeight"];
    NSString* textAlignment = [spanDetails objectForKey:@"textAlignment"];
    if (lineHeight || textAlignment) {
      NSMutableParagraphStyle* paragraphStyle = [[NSMutableParagraphStyle alloc] init];
      if ([textAlignment isEqualToString:@"middle"] || [textAlignment isEqualToString:@"center"]) {
        paragraphStyle.alignment = NSTextAlignmentCenter;
      } else if ([textAlignment isEqualToString:@"right"]) {
        paragraphStyle.alignment = NSTextAlignmentRight;
      } else {
        paragraphStyle.alignment = NSTextAlignmentLeft;
      }
      if (lineHeight) {
        CGFloat fLineHeight =  [lineHeight floatValue];
        if (fLineHeight == 0.0) {
          fLineHeight = 0.00001;
        }
        paragraphStyle.maximumLineHeight = fLineHeight;
        paragraphStyle.minimumLineHeight = fLineHeight;
      }
      [attributes setObject:paragraphStyle forKey:NSParagraphStyleAttributeName];
    }
    NSString* textDecoration = [spanDetails objectForKey:@"textDecoration"];
    if (textDecoration) {
      BOOL underline = [textDecoration containsString:@"underline" ];
      if (underline) {
        [attributes setObject:[NSNumber numberWithBool:underline] forKey:NSUnderlineStyleAttributeName];
      }
      BOOL strikethrough = [textDecoration containsString:@"line-through" ];
      if (strikethrough) {
        [attributes setObject:[NSNumber numberWithBool:strikethrough] forKey:NSStrikethroughStyleAttributeName];
      }
    }
    id text = [spanDetails objectForKey:@"text"];
    if (!([text isKindOfClass:[NSAttributedString class]])) {
      [result appendAttributedString:[[NSMutableAttributedString alloc] initWithString:text attributes:attributes]];
    }
    else {
      NSMutableAttributedString* resultSpan = [[NSMutableAttributedString alloc] initWithAttributedString:text];
      [resultSpan setAttributes:attributes range:NSMakeRange(0, [text length])];
      [result appendAttributedString:resultSpan];
      
    }
  }
  return result;
}
@end
