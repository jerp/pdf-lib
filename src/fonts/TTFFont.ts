
import { Font } from 'fonts/Font';

/**
 * This is the base class for all SFNT-based font formats in fontkit.
 * It supports TrueType, and PostScript glyphs, and several color glyph formats.
 */
export class TTFFont extends Font {
  static probe(data: Uint8Array) {
    let format = String.fromCharCode.apply(null, data.subarray(0, 4));
    return format === 'true' || format === 'OTTO' || format === String.fromCharCode(0, 1, 0, 0);
  }
  private genEmbededFontName() {
    const randomChar = () => String.fromCharCode(Math.random() * 26 + 65)
    return [randomChar(), randomChar(), randomChar(), randomChar(), '+', this.name.get('postscriptName')].join('')
  }
  private getFlags(): number {
    const familyClass = (this.os2.sFamilyClass || 0) >> 8
    let flags = 0
    if (this.post.isFixedPitch) {
      flags |= 1 << 0;
    }
    if ((1 <= familyClass && familyClass <= 7)) {
      flags |= 1 << 1;
    }
    flags |= 1 << 2;
    if (familyClass === 10) {
      flags |= 1 << 3;
    }
    if (this.head.macStyle.italic) {
      flags |= 1 << 6;
    }
    return flags
  }
  private scaledBbox(scale: number) {
    const head = this.head
    const bbox = [head.xMin, head.yMin, head.xMax, head.yMax]
    return bbox.map(m => m* scale)
  }
  getFontDescriptor(scale: number) {
    return {
      Type: 'FontDescriptor',
      FontName: this.genEmbededFontName(),
      Flags: this.getFlags(),
      FontBBox: this.scaledBbox(scale),
      ItalicAngle: this.post.italicAngle,
      Ascent: this.hhea.ascent * scale,
      Descent: this.hhea.descent * scale,
      CapHeight: (this.os2.sCapHeight || this.hhea.ascent) * scale,
      XHeight: (this.os2.sxHeight || 0) * scale,
      StemV: 0
    }
  }

  /** Check glyph existance */
  hasGlyphForCodePoint(codePoint: number): boolean {
    return !!this.cmap.get(codePoint);
  }

  /**
   * Returns a GlyphRun object, which includes an array of Glyphs and GlyphPositions for the given string.
   */
  layout() { // string, userFeatures, script, language, direction
    // return this._layoutEngine.layout(string, userFeatures, script, language, direction);
  }

  /**
   * An array of all [OpenType feature tags](https://www.microsoft.com/typography/otspec/featuretags.htm)
   * The features parameter is an array of OpenType feature tags to be applied in addition to the default set.
   * If this is an AAT font, the OpenType feature tags are mapped to AAT features.
   */
  getAvailableFeatures(script?: string, language?: string) {
    return []
  }

  /**
   * Returns an object describing the available variation axes
   * that this font supports. Keys are setting tags, and values
   * contain the axis name, range, and default value.
   */
  getVariationAxes(): any {
    // const axisList = this.fvar.axis || []
    // return axisList.reduce((variationAxis, axis) => {
    //   variationAxis[axis.axisTag.trim()] = {
    //     name: axis.name.en,
    //     min: axis.minValue,
    //     default: axis.defaultValue,
    //     max: axis.maxValue
    //   }
    //   return variationAxis
    // }, {})
    return {}
  }
  getNamedVariations(): any {
    // const instanceList = this.fvar.instance || []
    // return instanceList.reduce((namedVariations, axis) => {
    //   const namedVariation = {}
    //   axisList.forEach((axis, i) => {
    //     namedVariation[axis.axisTag.trim()] = instance.coord[i]
    //   })
    //   namedVariations[instance.name.en] = namedVariation
    //   return namedVariations
    // }, {})
    return {}
  }


  /**
   * Returns a new font with the given variation settings applied.
   * Settings can either be an instance name, or an object containing
   * variation tags as specified by the `variationAxes` property.
   *
   */
  getVariation(settings: string | any): Font {
    // if (!(this.fvar && ((this.gvar && this.glyf) || this.CFF2))) {
    //   throw new Error('Variations require a font with the fvar, gvar and glyf, or CFF2 tables.');
    // }

    // if (typeof settings === 'string') {
    //   settings = this.namedVariations[settings];
    // }

    // if (typeof settings !== 'object') {
    //   throw new Error('Variation settings must be either a variation name or settings object.');
    // }

    // // normalize the coordinates
    // let coords = this.fvar.axis.map((axis, i) => {
    //   let axisTag = axis.axisTag.trim();
    //   if (axisTag in settings) {
    //     return Math.max(axis.minValue, Math.min(axis.maxValue, settings[axisTag]));
    //   } else {
    //     return axis.defaultValue;
    //   }
    // });

    // let stream = new r.Decoder(this.stream.buffer);
    // stream.pos = this._directoryPos;

    // let font = new TTFFont(stream, coords);
    // font._tables = this._tables;

    return this // font
  }
  encode() {
    // simple copy of head hhea maxp cvt prep fpgm
    return super.doEncode([
      this.head,
      this.hhea,
      this.loca,
      this.maxp,
      this.cvt ,
      this.prep,
      this.glyf,
      this.hmtx,
      this.fpgm,
    ])
  }
}
