import { TTFFont } from 'fonts/TTFFont'
import { IFont } from 'fonts/Font'
import { EmbededFont } from 'fonts/EmbededFont'
import { readFileSync } from 'fs'
const fontkit = require('fontkit')

const testFontFile = (fontFile) => readFileSync(`${__dirname}/../../__integration_tests__/assets/fonts/${fontFile}`)

describe('EmbededTTFFont', () => {
  // describe.skip('Embeds Mini TTF Font with internal TTFFont and with fontkit', () => {
  //   const font = new TTFFont(new Uint8Array(testFontFile('CharisSIL/CharisSIL-abc.ttf')))
  //   const fkFont = fontkit.create(testFontFile('CharisSIL/CharisSIL-abc.ttf'))
  //   it('loads same properties', () => {
  //     const embededFont = EmbededFont.for(font)
  //     const embededFkFont = EmbededFont.for(fkFont)
  //     expect(embededFont.ascent).toBe(embededFkFont.ascent)
  //     expect(embededFont.fontBBox).toMatchObject(embededFkFont.fontBBox)
  //     expect(embededFont.capHeight).toBe(embededFkFont.capHeight)
  //     expect(embededFont.descent).toBe(embededFkFont.descent)
  //     expect(embededFont.familyClass).toBe(embededFkFont.familyClass)
  //     expect(embededFont.flags).toBe(embededFkFont.flags)
  //     //expect(embededFont.lineGap)embededFont.exkFpect()
  //     expect(embededFont.macStyleItalic).toBe(embededFkFont.macStyleItalic)
  //     expect(embededFont.unitsPerEm).toBe(embededFkFont.unitsPerEm)
  //     expect(embededFont.italicAngle).toBe(embededFkFont.italicAngle)
  //     expect(embededFont.isFixedPitch).toBe(embededFkFont.isFixedPitch)
  //     expect(embededFont.postScriptName).toBe(embededFkFont.postScriptName)
  //     expect(embededFont.xHeight).toBe(embededFkFont.xHeight)
  //   })
  //   it('layout text', () => {
  //     const embededFont = EmbededFont.for(font)
  //     const embededFkFont = EmbededFont.for(fkFont)
  //     expect(embededFont.encodeText('b')).toMatchObject(embededFkFont.encodeText('b'))
  //     expect(embededFont.encodeText('ab')).toMatchObject(embededFkFont.encodeText('ab'))
  //     expect(embededFont.encodeText('cab')).toMatchObject([3,2,1])
  //   })
  //   it('encodes font', () => {
  //     const embededFont = EmbededFont.for(font)
  //     const embededFkFont = EmbededFont.for(fkFont)
  //     embededFont.encodeText('cab')
  //     embededFkFont.encodeText('cab')
  //     const subsetData = embededFont.subsetData
  //     const subsetDataFk = embededFkFont.subsetData
  //     expect(subsetData.CMap).toMatchObject(subsetDataFk.CMap)
  //     expect(subsetData.widths).toMatchObject(subsetDataFk.widths)
  //     expect(subsetData.data.length).toBe(subsetDataFk.data.length)
  //   })
  // })
  describe('Embeds other TTF fonts', () => {
    const fontPaths = [
      'bio_rhyme/BioRhymeExpanded-Bold.ttf',
      'ubuntu/Ubuntu-R.ttf',
      'press_start_2p/PressStart2P-Regular.ttf',
      'indie_flower/IndieFlower.ttf',
      'great_vibes/GreatVibes-Regular.ttf'
    ]
    fontPaths.forEach(fontPath => {
      it(`encodes various ${fontPath}`, () => {
        const font = new TTFFont(new Uint8Array(testFontFile(fontPath)))
        const embededFont = EmbededFont.for(font)
        embededFont.encodeText('abc')
        const subsetData = embededFont.subsetData
        expect(subsetData.data.length).toBeGreaterThan(0)
      })
    })
  })
  describe.only('Embeds other TTF fonts', () => {
    const fontPaths = [
      // 'fantasque/OTF/FantasqueSansMono-BoldItalic.otf',
      // 'hussar_3d/Hussar3DFour.otf',
      'apple_storm/AppleStormCBo.otf',
    ]
    fontPaths.forEach(fontPath => {
      it(`encodes various ${fontPath}`, () => {
        const font = fontkit.create(testFontFile(fontPath))
        const embededFont = EmbededFont.for(font)
        embededFont.encodeText('abc')
        const subsetData = embededFont.subsetData
        expect(subsetData.data.length).toBeGreaterThan(0)
      })
    })
  })

})
