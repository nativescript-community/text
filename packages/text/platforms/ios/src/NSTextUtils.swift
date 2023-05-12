import CoreFoundation
import UIKit
import CoreGraphics

@objcMembers
@objc(NSTextUtils)
class NSTextUtils: NSObject {
  class func setTextDecorationAndTransformOn(view:UIView!, text:String!, textDecoration:String!, letterSpacing:CGFloat, lineHeight:CGFloat, color:UIColor!) {
    let attrDict:NSMutableDictionary! = NSMutableDictionary()
    var paragraphStyle:NSMutableParagraphStyle! = nil
    let isTextType:Bool = (view is UITextField) || (view is UITextView) || (view is UILabel) || (view is UIButton)
    let isTextView:Bool = (view is UITextView)
    
    if textDecoration.contains("underline") {
      attrDict[NSAttributedString.Key.underlineStyle] = (NSUnderlineStyle.single)
    }
    
    if textDecoration.contains("line-through") {
      attrDict[NSAttributedString.Key.strikethroughStyle] = (NSUnderlineStyle.single)
    }
    
    if letterSpacing != 0 && isTextType && (view as! UILabel).font != nil {
      let kern:NSNumber! = NSNumber.init(value: letterSpacing * (view as! UILabel).font.pointSize)
      attrDict[NSAttributedString.Key.kern] = kern
    }
    var fLineHeight = lineHeight
    if fLineHeight >= 0 {
      if fLineHeight == 0 {
        fLineHeight = 0.00001
      }
      if paragraphStyle == nil {
        paragraphStyle = NSMutableParagraphStyle()
      }
      paragraphStyle.minimumLineHeight = fLineHeight
      paragraphStyle.maximumLineHeight = fLineHeight
      // make sure a possible previously set text alignment setting is not lost when line height is specified
      
      
    }
    if (paragraphStyle != nil) {
      if (view is UIButton) {
        paragraphStyle.alignment = (view as! UIButton).titleLabel!.textAlignment
      } else {
        paragraphStyle.alignment = (view as! UILabel).textAlignment
      }
      if (view is UILabel) {
        // make sure a possible previously set line break mode is not lost when line height is specified
        paragraphStyle.lineBreakMode = (view as! UILabel).lineBreakMode
      }
      attrDict[NSAttributedString.Key.paragraphStyle] = paragraphStyle
    }
    
    if attrDict.count > 0 {
      if isTextView && ((view as! UITextView).font != nil) {
        // UITextView's font seems to change inside.
        attrDict[NSAttributedString.Key.font] = (view as! UITextView).font
      }
      
      if color != nil {
        attrDict[NSAttributedString.Key.foregroundColor] = color
      }
      
      let result:NSMutableAttributedString! = NSMutableAttributedString(string:text)
      result.setAttributes((attrDict as! [NSAttributedString.Key : Any]), range:NSRange(location: 0, length: text.count))
      
      if (view is UIButton) {
        (view as! UIButton).setAttributedTitle(result, for:UIControl.State.normal)
      }
      else if(view is UILabel) {
        (view as! UILabel).attributedText = result
      } else if(view is UITextView) {
        (view as! UITextView).attributedText = result
      }
    } else {
      if (view is UIButton) {
        // Clear attributedText or title won't be affected.
        (view as! UIButton).setAttributedTitle(nil, for:UIControl.State.normal)
        (view as! UIButton).setTitle(text, for:UIControl.State.normal)
      } else if(view is UILabel) {
        // Clear attributedText or text won't be affected.
        (view as! UILabel).attributedText = nil
        (view as! UILabel).text = text
      } else if(view is UITextView) {
        // Clear attributedText or text won't be affected.
        (view as! UITextView).attributedText = nil
        (view as! UITextView).text = text
      }
    }
  }
  class func computeBaseLineOffset(align:String!, fontAscent:Float, fontDescent:Float, fontBottom:Float, fontTop:Float, fontSize:Float, maxFontSize:Float) -> Float {
    var result:Float = 0
    if (align == "top") {
      result = -maxFontSize - fontBottom - fontTop
    } else if (align == "bottom") {
      result = fontBottom
    } else if (align == "text-top") {
      result = -maxFontSize - fontDescent - fontAscent
    } else if (align == "text-bottom") {
      result = fontBottom - fontDescent
    } else if (align == "middle") || (align == "center") {
      result = (fontAscent - fontDescent) / 2 - fontAscent - maxFontSize / 2
    } else if (align == "super") {
      result = -(maxFontSize - fontSize)
    } else if (align == "sub") {
      result = 0
    }
    return result
  }
  
  class func createNativeHTMLAttributedString(_ data:NSDictionary!) -> NSMutableAttributedString! {
    do {
      //    if (!attributedString) {
      //        NSData* data = [nsString dataUsingEncoding: NSUnicodeStringEncoding allowLossyConversion: YES];
      //        attributedString = [[NSMutableAttributedString alloc] initWithHTML:data
      //    }
      let htmlString:String! = data.object(forKey: "htmlString") as? String
      let dic:NSDictionary! = [NSAttributedString.DocumentAttributeKey.documentType: NSAttributedString.DocumentType.html,
                               NSAttributedString.DocumentReadingOptionKey.characterEncoding: NSUTF8StringEncoding]
      let attrText:NSMutableAttributedString! = try NSMutableAttributedString(data:htmlString.data(using: String.Encoding(rawValue: NSUTF8StringEncoding), allowLossyConversion: false)!, options:dic as! [NSAttributedString.DocumentReadingOptionKey : Any], documentAttributes:nil)
      
      let fullRange:NSRange = NSRange(location: 0, length: attrText.length)
      let linkColor:UIColor! = data.object(forKey:"linkColor") as? UIColor
      let useCustomLinkTag:NSNumber! =  data.object(forKey:"useCustomLinkTag") as? NSNumber
      if (linkColor != nil) || useCustomLinkTag.boolValue {
        // if linkColor is used for non UITextView we cant use NSLinkAttributeName
        // as it will force the rendered color
        attrText.enumerateAttribute(NSAttributedString.Key.link, in: fullRange) { value, range, stop in
          if (value != nil) {
            let attributes:NSMutableDictionary! = NSMutableDictionary(dictionary:attrText.attributes(at: range.location, longestEffectiveRange:nil, in:range))
            var sValue:String! = nil
            if (value is NSURL) {
              sValue = (value as! NSURL).absoluteString
            } else {
              sValue = value as? String
            }
            if sValue.hasPrefix("applewebdata://") {
              let index = sValue.lastIndex(of: "/")
              attributes.setObject(sValue[index!...], forKey:"CustomLinkAttribute" as NSCopying)
              
            } else {
              attributes.setObject(sValue, forKey:"CustomLinkAttribute" as NSCopying)
            }
            attributes.removeObject(forKey: NSAttributedString.Key.link)
            attrText.setAttributes(attributes as? [NSAttributedString.Key : Any], range:range)
          }
        }
      }
      // }
      let autoFontSizeEnabled:NSNumber! =  data.object(forKey:"autoFontSizeEnabled") as? NSNumber
      if autoFontSizeEnabled.boolValue {
        attrText.enumerateAttribute(NSAttributedString.Key.font, in:fullRange ){ value, range, stop in
          if ((value) != nil){
            let fontValue: UIFont = value as! UIFont;
            attrText.addAttribute(NSAttributedString.Key(rawValue: "OriginalFontSize") , value:fontValue.pointSize, range:range)
          }
        }
      }
      
      let letterSpacing:NSNumber! =  data.object(forKey:"letterSpacing") as? NSNumber
      let fontSize:NSNumber! =  data.object(forKey:"fontSize") as? NSNumber
      if (letterSpacing != nil) && letterSpacing.floatValue != 0 {
        attrText.addAttribute(NSAttributedString.Key.kern, value:letterSpacing.floatValue * fontSize.floatValue, range:fullRange)
      }
      var paragraphStyle:NSMutableParagraphStyle! = nil
      let textAlignment:NSNumber! =  data.object(forKey:"textAlignment") as? NSNumber
      let createParagraphStyle:()->Void = {
        if (paragraphStyle == nil) {
          paragraphStyle = NSMutableParagraphStyle()
          if (textAlignment != nil) {
            paragraphStyle.alignment = NSTextAlignment(rawValue:  textAlignment.intValue)!
            
          }
        }
      }
      if (textAlignment != nil) {
        createParagraphStyle()
      }
      let lineBreak:NSNumber! =  data.object(forKey:"lineBreak") as? NSNumber
      if (lineBreak != nil) {
        
        createParagraphStyle()
        // make sure a possible previously set line break mode is not lost when line height is specified
        paragraphStyle.lineBreakMode = NSLineBreakMode(rawValue:  lineBreak.intValue)!
      }
      let lineHeight:NSNumber! =  data.object(forKey:"lineHeight") as? NSNumber
      if (lineHeight != nil) {
        createParagraphStyle()
        var fLineHeight:Float = lineHeight.floatValue
        if fLineHeight == 0.0 {
          fLineHeight = 0.00001
        }
        paragraphStyle.minimumLineHeight = CGFloat(fLineHeight)
        paragraphStyle.maximumLineHeight = CGFloat(fLineHeight)
        // make sure a possible previously set text alignment setting is not lost when line height is specified
        // if (this.nativeTextViewProtected instanceof UILabel) {
        //     paragraphStyle.lineBreakMode = this.nativeTextViewProtected.lineBreakMode;
        // }
      }
      if (paragraphStyle != nil) {
        attrText.addAttribute(NSAttributedString.Key.paragraphStyle, value:paragraphStyle, range:fullRange)
      }
      return attrText
    } catch {
      return nil;
    }
    
  }
  
  class func createNativeAttributedString(_ data:NSDictionary!) -> NSMutableAttributedString! {
    let result:NSMutableAttributedString! = NSMutableAttributedString()
    let details: [NSDictionary] = (data.object(forKey: "details") as! NSArray) as! [NSDictionary]
    for spanDetails: NSDictionary in details {
      let text = spanDetails.object(forKey: "text")
      if text == nil {
        continue
      }
      let attributes:NSMutableDictionary! = NSMutableDictionary()
      let iosFont:UIFont! = spanDetails.object(forKey: "iosFont") as? UIFont
      if (iosFont != nil) {
        attributes.setObject(iosFont, forKey:NSAttributedString.Key.font as NSCopying)
      }
      let autoFontSizeEnabled:NSNumber! = spanDetails.object(forKey: "autoFontSizeEnabled") as? NSNumber
      if autoFontSizeEnabled.boolValue {
        attributes.setObject(spanDetails.object(forKey: "realFontSize")!, forKey:"OriginalFontSize" as NSCopying)
        
      }
      let verticalTextAlignment:String! = spanDetails.object(forKey: "verticalTextAlignment") as? String
      if (verticalTextAlignment != nil) && (iosFont != nil) && !(verticalTextAlignment == "initial") && !(verticalTextAlignment == "stretch") {
        let fontSize:NSNumber! = spanDetails.object(forKey: "fontSize") as? NSNumber
        let ctFont:CTFont = iosFont
        let ascent:CGFloat = CTFontGetAscent(ctFont)
        let descent:CGFloat = CTFontGetDescent(ctFont)
        let realMaxFontSize:NSNumber! = spanDetails.object(forKey: "realMaxFontSize") as? NSNumber
        attributes.setObject(-computeBaseLineOffset(align: verticalTextAlignment, fontAscent: -Float(ascent), fontDescent: Float(descent), fontBottom: -Float(iosFont.descender), fontTop: -Float(iosFont.ascender), fontSize: (fontSize.floatValue), maxFontSize: (realMaxFontSize.floatValue)), forKey:NSAttributedString.Key.baselineOffset as NSCopying)
      }
      let color:UIColor! = spanDetails.object(forKey: "color") as? UIColor
      if (color != nil) {
        attributes.setObject(color, forKey:NSAttributedString.Key.foregroundColor as NSCopying)
        
      }
      let backgroundColor:UIColor! = spanDetails.object(forKey: "backgroundColor") as? UIColor
      if (backgroundColor != nil) {
        attributes.setObject(backgroundColor, forKey:NSAttributedString.Key.backgroundColor as NSCopying)
      }
      let letterSpacing:NSNumber! = spanDetails.object(forKey: "letterSpacing") as? NSNumber
      if (iosFont != nil) && (letterSpacing != nil) {
        attributes.setObject((letterSpacing.floatValue * Float(iosFont.pointSize)), forKey:NSAttributedString.Key.kern as NSCopying)
      }
      
      let tapIndex:NSNumber! = spanDetails.object(forKey: "tapIndex") as? NSNumber
      if (tapIndex != nil) {
        attributes.setObject(tapIndex, forKey:"CustomLinkAttribute" as NSCopying)
      }
      let lineHeight:NSNumber! = spanDetails.object(forKey: "lineHeight") as? NSNumber
      let textAlignment:String! = spanDetails.object(forKey: "textAlignment") as? String
      if (lineHeight != nil) || (textAlignment != nil) {
        let paragraphStyle:NSMutableParagraphStyle! = NSMutableParagraphStyle()
        if (textAlignment == "middle") || (textAlignment == "center") {
          paragraphStyle.alignment = NSTextAlignment.center
        } else if (textAlignment == "right") {
          paragraphStyle.alignment = NSTextAlignment.right
        } else {
          paragraphStyle.alignment = NSTextAlignment.left
        }
        if (lineHeight != nil) {
          var fLineHeight:CGFloat = CGFloat(lineHeight.floatValue)
          if fLineHeight == 0.0 {
            fLineHeight = 0.00001
          }
          paragraphStyle.maximumLineHeight = fLineHeight
          paragraphStyle.minimumLineHeight = fLineHeight
        }
        attributes.setObject(paragraphStyle, forKey:NSAttributedString.Key.paragraphStyle as NSCopying as NSCopying)
      }
      let textDecoration:String! = spanDetails.object(forKey: "textDecoration") as? String
      if (textDecoration != nil) {
        let underline:Bool = textDecoration.contains("underline")
        if underline {
          attributes.setObject(underline, forKey:NSAttributedString.Key.underlineStyle as NSCopying)
        }
        let strikethrough:Bool = textDecoration.contains("line-through")
        if strikethrough {
          attributes.setObject(strikethrough, forKey:NSAttributedString.Key.strikethroughStyle as NSCopying)
        }
      }
      if text is NSAttributedString {
        let resultSpan:NSMutableAttributedString! = NSMutableAttributedString(attributedString:text as! NSAttributedString)
        resultSpan.setAttributes(attributes as? [NSAttributedString.Key : Any], range:NSRange(location: 0, length: (text as! NSAttributedString).length));                      result.append(resultSpan)
      }
      else if text is String {
        result.append(NSMutableAttributedString(string:text as! String, attributes:attributes as? [NSAttributedString.Key : Any]))
        
      }
    }
    return result
  }
}
