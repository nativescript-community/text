package com.nativescript.text;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Typeface;
import android.os.Build;
import android.text.SpannableStringBuilder;
import android.text.style.AbsoluteSizeSpan;
import android.text.style.RelativeSizeSpan;
import android.text.style.BackgroundColorSpan;
import android.text.style.ForegroundColorSpan;
import android.text.style.TypefaceSpan;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;

import org.xml.sax.InputSource;

import java.io.File;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.StringTokenizer;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

public class Font {
    static AssetManager appAssets;
    static HashMap<String, Typeface> typefaceCache = new HashMap<String, Typeface>();
    static HashMap<String, Typeface> typefaceCreatedCache = new HashMap<String, Typeface>();

    static final String TAG = "Font";

    public static Typeface loadFontFromFile(Context context, String fontFolder, String fontFamily) {
        if (typefaceCache.containsKey(fontFamily)) {
            return typefaceCache.get(fontFamily);
        }
        Typeface result = null;
        if (fontFamily.startsWith("res/")) {
            int fontID = context.getResources().getIdentifier(fontFamily.substring(4), "font",
                    context.getPackageName());
            try {
                result = androidx.core.content.res.ResourcesCompat.getFont(context, fontID);
            } catch (Exception e) {
                Log.w(TAG, "\"Error loading font res: " + fontFamily + "," + e.getLocalizedMessage());
            }
            if (result != null) {
                typefaceCache.put(fontFamily, result);
                return result;
            }
        }

        if (appAssets == null) {
            appAssets = context.getAssets();
        }
        if (appAssets == null) {
            return null;
        }

        result = typefaceCache.get(fontFamily);
        // Check for undefined explicitly as null mean we tried to load the font, but
        // failed.
        File file = new File(fontFolder, fontFamily + ".ttf");
        // const basePath = fs.path.join(fs.knownFolders.currentApp().path, "fonts",
        // fontFamily);

        if (!file.exists()) {
            file = new File(fontFolder, fontFamily + ".otf");
            if (!file.exists()) {
                Log.w(TAG, "Could not find font file for " + fontFamily + " in folder " + fontFolder);
                return null;
            }

        }

        try {
            result = Typeface.createFromFile(file.getAbsolutePath());
        } catch (Exception e) {
            Log.w(TAG, "\"Error loading font asset: " + file.getAbsolutePath() + "," + e.getLocalizedMessage());
        }
        typefaceCache.put(fontFamily, result);

        return result;
    }

    public interface FontWeight {
        String THIN = "thin";
        String EXTRA_LIGHT = "extralight";
        String LIGHT = "light";
        String NORMAL = "normal";
        String MEDIUM = "medium";
        String SEMI_BOLD = "semibold";
        String BOLD = "bold";
        String EXTRA_BOLD = "extrabold";
        String BLACK = "black";
    }

    public interface genericFontFamilies {
        String serif = "serif";
        String sansSerif = "sans-serif";
        String monospace = "monospace";
        String system = "system";
    }

    public static int getIntFontWeight(String fontWeight) {
        if (fontWeight == null) {
            return 400;
        }
        switch (fontWeight) {
            case FontWeight.THIN:
                return 100;
            case FontWeight.EXTRA_LIGHT:
                return 200;
            case FontWeight.LIGHT:
                return 300;
            case FontWeight.NORMAL:
                return 400;
            case FontWeight.MEDIUM:
                return 500;
            case FontWeight.SEMI_BOLD:
                return 600;
            case FontWeight.BOLD:
                return 700;
            case FontWeight.EXTRA_BOLD:
                return 800;
            case FontWeight.BLACK:
                return 900;
            default:
                return Integer.parseInt(fontWeight, 10);
        }
    }
    public static String getCustomFontWeightSuffix(int fontWeight) {
        switch (fontWeight) {
            case 100:
                return "_thin";
            case 200:
                return "_extralight";
            case 300:
                return "_light";
            case 400:
                return "_regular";
            case 500:
                return "_medium";
            case 600:
                return "_semibold";
            case 700:
                return "_bold";
            case 800:
                return "_extrabold";
            case 900:
                return "_black";
            default:
                throw new Error("Invalid font weight:" + fontWeight);
        }
    }

    public static String getFontWeightSuffix(int fontWeight) {

        switch (fontWeight) {
            case 100:
                return Build.VERSION.SDK_INT >= 16 ? "-thin" : "";
            case 200:
            case 300:
                return Build.VERSION.SDK_INT >= 16 ? "-light" : "";
            case 400:
                return "";
            case 500:
            case 600:
                return Build.VERSION.SDK_INT >= 21 ? "-medium" : "";
            case 700:
            case 800:
                return Build.VERSION.SDK_INT >= 21 ? "-bold" : "";
            case 900:
                return Build.VERSION.SDK_INT >= 21 ? "-black" : "";
            default:
                throw new Error("Invalid font weight:" + fontWeight);
        }
    }

    public static ArrayList<String> parseFontFamily(String value) {
        ArrayList<String> result = new ArrayList<String>();
        if (value == null) {
            return result;
        }
        if (!value.contains(",")) {
            result.add(value.replace("'", "").replace("\"", ""));
            return result;
        }

        // not removing the "['\"]+" and not trimming make the parseFontFamily much
        // faster!
        // should be done in span/text properties
        StringTokenizer st = new StringTokenizer(value, ",");
        while (st.hasMoreTokens()) {
            result.add(st.nextToken().replace("'", "").replace("\"", "").trim());
        }
        return result;
    }

    public static Typeface createTypeface(Context context, String fontFolder, String fontFamily, String fontWeight,
            boolean isBold, boolean isItalic) {

        int fontStyle = 0;
        if (isBold) {
            fontStyle |= Typeface.BOLD;
        }
        if (isItalic) {
            fontStyle |= Typeface.ITALIC;
        }
        int fontWeightInt = getIntFontWeight(fontWeight);
        final String cacheKey = fontFamily + fontWeightInt + isItalic;
        // Log.d("JS", "Font createTypeface: " + fontFamily + ",fontFolder " +
        // fontFolder + ",isItalic " + isItalic + ",fontWeight " + fontWeight
        // + ",fontWeightInt " + fontWeightInt);
        if (typefaceCreatedCache.containsKey(cacheKey)) {
            return typefaceCreatedCache.get(cacheKey);
        }
        // http://stackoverflow.com/questions/19691530/valid-values-for-androidfontfamily-and-what-they-map-to
        ArrayList<String> fonts = parseFontFamily(fontFamily);
        // Log.d(TAG, "createTypeface1: " + fonts.toString());
        Typeface result = null;
        for (int i = 0; i < fonts.size(); i++) {
            switch (fonts.get(i).toLowerCase()) {
                case genericFontFamilies.serif:
                    result = Typeface.create("serif" + getFontWeightSuffix(fontWeightInt), fontStyle);
                    break;

                case genericFontFamilies.sansSerif:
                case genericFontFamilies.system:
                    result = Typeface.create("sans-serif" + getFontWeightSuffix(fontWeightInt), fontStyle);
                    break;

                case genericFontFamilies.monospace:
                    result = Typeface.create("monospace" + getFontWeightSuffix(fontWeightInt), fontStyle);
                    break;

                default:
                    String currentFontFamily =  fonts.get(i);
                    if(Build.VERSION.SDK_INT < 28 && fontWeightInt != 400) {
                        String newFontFamily = currentFontFamily;
                        // on pre 28 Typeface.create does not support passing the fontWeight
                        // so we need to try and load the font directly hoping the file is named correctly
                        if(fontWeightInt == 400) {
                            if (isItalic) {
                                result = loadFontFromFile(context, fontFolder, newFontFamily + "_italic"); 
                                if (result != null) {
                                    fontStyle = 0;
                                } else {
                                    result = loadFontFromFile(context, fontFolder, newFontFamily); 
                                }
                            } else {
                                result = loadFontFromFile(context, fontFolder, newFontFamily); 
                                if (result != null) {
                                    fontStyle = 0;
                                }
                            }
                        } else {
                            newFontFamily += getCustomFontWeightSuffix(fontWeightInt);
                            if (isItalic) {
                                result = loadFontFromFile(context, fontFolder, newFontFamily + "italic"); 
                                if (result != null) {
                                    // Log.d("JS", "Font loading font style found: " + newFontFamily + ",fontStyle "
                                    // + fontStyle + ",fontWeightInt " + fontWeightInt);
                                    fontStyle = 0;
                                } else {
                                    result = loadFontFromFile(context, fontFolder, newFontFamily); 
                                }
                            } else {
                                result = loadFontFromFile(context, fontFolder, newFontFamily); 
                                if (result != null) {
                                    fontStyle = 0;
                                }
                            }
                            
                        }
                    }
                    if(result == null) {
                        result = loadFontFromFile(context, fontFolder, currentFontFamily); 
                    }

                    if (result != null && (fontStyle != 0 || fontWeightInt != 400)) {
                        if (Build.VERSION.SDK_INT >= 28) {
                            result = Typeface.create(result, fontWeightInt, isItalic);
                        } else if(fontStyle != 0) {
                            // Log.d("JS", "Font loading font style found: " + fonts.get(i) + ",fontStyle "
                            // + fontStyle + ",fontWeightInt " + fontWeightInt);
                            result = Typeface.create(result, fontStyle);
                        }
                    }
                    break;
            }

            if (result != null) {
                // Found the font!
                // Log.d("JS", "Font found: " + fonts.get(i) + ",fontStyle " + fontStyle +
                // ",fontWeightInt " + fontWeightInt);
                break;
            }
        }

        if (result == null) {
            result = Typeface.create("sans-serif" + getFontWeightSuffix(fontWeightInt), fontStyle);
        }
        typefaceCreatedCache.put(cacheKey, result);
        return result;
    }

    public static SpannableStringBuilder stringBuilderFromHtmlString(Context context, String fontFolder, String parentFontFamily,
            String htmlString, final boolean disableLinkUnderline, final int linkColor) {
        if (htmlString == null) {
            return null;
        }
        CharSequence spannedString = fromHtml(htmlString, context, fontFolder, parentFontFamily, disableLinkUnderline, linkColor);
        SpannableStringBuilder builder = new SpannableStringBuilder(spannedString);

        return builder;
    }

    public static void setSpanModifiers(Context context, String fontFolder, String parentFontFamily, SpannableStringBuilder ssb,
            JSONObject span, int start, int end) {
        String fontWeight = span.optString("fontWeight", null);
        String fontStyle = span.optString("fontStyle", null);
        boolean bold = fontWeight != null &&  (fontWeight.equals("bold") || fontWeight.equals("700"));
        boolean italic = fontStyle != null &&  fontStyle.equals("italic");

        // if (android.os.Build.VERSION.SDK_INT < 28) {
            
        // }

        String fontFamily = span.optString("fontFamily", null);
        if (fontFamily == null && parentFontFamily != null) {
            fontFamily = parentFontFamily;
        }
        Typeface typeface = null;
        if (fontFamily != null) {
            typeface = createTypeface(context, fontFolder, fontFamily,fontWeight, bold, italic);
            TypefaceSpan typefaceSpan = new CustomTypefaceSpan(fontFamily, typeface);
            ssb.setSpan(typefaceSpan, start, end, android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        if (bold && italic && (typeface == null || (!typeface.isItalic() && !typeface.isBold()))) {
            ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        } else if (bold && (typeface == null || !typeface.isBold())) {
            ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        } else if (italic && (typeface == null || !typeface.isItalic())) {
            ssb.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
        Double fontSize = span.optDouble("fontSize");
        Double maxFontSize =  span.optDouble("maxFontSize");
        String verticalTextAlignment = span.optString("verticalTextAlignment", null);
        if (verticalTextAlignment != null && !verticalTextAlignment.equals("initial") && !verticalTextAlignment.equals("stretch")) {
            ssb.setSpan(new BaselineAdjustedSpan(Double.isNaN(fontSize)?-1:fontSize.floatValue(), verticalTextAlignment, maxFontSize.floatValue()), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                    
        }
        if (!Double.isNaN(fontSize)) {
            ssb.setSpan(new AbsoluteSizeSpan(fontSize.intValue()), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
        Double relativeSize = span.optDouble("relativeSize");
        if (!Double.isNaN(relativeSize)) {
            ssb.setSpan(new RelativeSizeSpan(relativeSize.floatValue()), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        Double letterSpacing = span.optDouble("letterSpacing");
        if (!Double.isNaN(letterSpacing)) {
            if (Build.VERSION.SDK_INT >= 21) {
                ssb.setSpan(new com.nativescript.text.LetterSpacingSpan(letterSpacing.floatValue()), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            } else {
                ssb.setSpan(new android.text.style.ScaleXSpan((letterSpacing.floatValue() + 1) / 10), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            
        }
        Double lineHeight =  span.optDouble("lineHeight");
        if (!Double.isNaN(lineHeight)) {
            ssb.setSpan(new HeightSpan(lineHeight.intValue()), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        int color = span.optInt("color", -1);
        if (color != -1) {
            ssb.setSpan(new ForegroundColorSpan(color), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        int backgroundColor = span.optInt("backgroundColor", -1);
        if (backgroundColor != -1) {
            ssb.setSpan(new BackgroundColorSpan(backgroundColor), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

        String textDecoration = span.optString("textDecoration", null);
        if (textDecoration != null) {
            if (textDecoration.contains("underline")) {
                ssb.setSpan(new android.text.style.UnderlineSpan(), start, end,
                        android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }

            if (textDecoration.contains("line-through")) {
                ssb.setSpan(new android.text.style.StrikethroughSpan(), start, end,
                        android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
        }
        int tapIndex = span.optInt("tapIndex", -1);
        if (tapIndex != -1) {
            ssb.setSpan(new URLSpanNoUnderline(String.valueOf(tapIndex), false, 0, true), start, end,
                    android.text.Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }

    }

    public static SpannableStringBuilder stringBuilderFromFormattedString(Context context, String fontFolder, String parentFontFamily,
            String options, SpannableStringBuilder ssb) {
        if (options == null) {
            return null;
        }
        try {
            JSONArray arrayOptions = new JSONArray(options);
            if (ssb == null) {
                ssb = new SpannableStringBuilder();
            } else {
                ssb.clear();
                ssb.clearSpans();
            }
            for (int i = 0, spanStart = 0, spanLength = 0, length = arrayOptions.length(); i < length; i++) {
                JSONObject span = (JSONObject)arrayOptions.get(i);
                String text = span.optString("text", "");
                spanLength = text.length();
                if (spanLength > 0) {
                    ssb.insert(spanStart, text);
                    setSpanModifiers(context, fontFolder, parentFontFamily, ssb, span, spanStart, spanStart + spanLength);
                    spanStart += spanLength;
                }
            }
            return ssb;

        } catch (JSONException e) {
            Log.e("TEXT", "parse error", e);
            return null;
        }
        // ArrayList<ArrayList<String>> parsedFormattedString = parseFormattedString(formattedString);
        // SpannableStringBuilder ssb = new SpannableStringBuilder();
        // for (int i = 0, spanStart = 0, spanLength = 0, length = parsedFormattedString.size(); i < length; i++) {
        //     ArrayList<String> span = parsedFormattedString.get(i);
        //     String text = span.get(11);
        //     spanLength = text.length();
        //     if (spanLength > 0) {
        //         ssb.insert(spanStart, text);
        //         setSpanModifiers(context, fontFolder, parentFontFamily, ssb, span, spanStart, spanStart + spanLength);
        //         spanStart += spanLength;
        //     }
        // }

    }

    static SAXParser saxParser = null;
    static HtmlToSpannedConverter converter = null;

    public static CharSequence fromHtml(CharSequence html, Context context, String fontFolder, String parentFontFamily,
            final boolean disableLinkUnderline, final int linkColor) {
        // long startTime = System.nanoTime();
        // XMLReader xmlReader;
        try {
            if (saxParser == null) {
                SAXParserFactory factory = SAXParserFactory.newInstance();
                saxParser = factory.newSAXParser();
            }
            if (converter == null) {
                converter = new HtmlToSpannedConverter(context, fontFolder, parentFontFamily, null, null, disableLinkUnderline, linkColor);
            } else {
                converter.reset();
                converter.disableLinkUnderline = disableLinkUnderline;
                converter.linkColor = linkColor;
            }
            // Log.d(TAG, "parse: " +html);
            final String toParse = "<doc>" + ((String) html).replaceAll("<br>", "<br></br>") + "</doc>";
            saxParser.parse(new InputSource(new StringReader(toParse)), converter);
            // Log.d(TAG, "fromHtml: " + ((System.nanoTime() - startTime)/1000000) + "ms");
            return converter.spannable();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return html;
    }

    public static CharSequence fromHtml(Context context, String fontFolder, String parentFontFamily, CharSequence html, final boolean disableLinkUnderline, final int linkColor) {
        return fromHtml(html, context, fontFolder, parentFontFamily, disableLinkUnderline, linkColor);
    }
    private static float FONT_SIZE_FACTOR = -1;
    public static float getFontSizeFactor(Context context) {
        if (FONT_SIZE_FACTOR == -1) {
            FONT_SIZE_FACTOR = android.util.TypedValue.applyDimension(
            android.util.TypedValue.COMPLEX_UNIT_SP, 1, context.getResources().getDisplayMetrics());
        }
        return FONT_SIZE_FACTOR;
    }
}
