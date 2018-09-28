import { IFont } from 'fonts/Font'
export interface ITestAssets {
  fonts: {
    ttf: {
      ubuntu_r: IFont;
      bio_rhyme_r: IFont;
      press_start_2p_r: IFont;
      indie_flower_r: IFont;
      great_vibes_r: IFont;
      CharisSIL_r: IFont;
    };
    otf: {
      fantasque_sans_mono_bi: IFont;
      apple_storm_r: IFont;
      hussar_3d_r: IFont;
    };
  };
  images: {
    jpg: {
      cat_riding_unicorn: Uint8Array;
      minions_laughing: Uint8Array;
    };
    png: {
      greyscale_bird: Uint8Array;
      minions_banana_alpha: Uint8Array;
      minions_banana_no_alpha: Uint8Array;
      small_mario: Uint8Array;
    };
  };
  pdfs: {
    normal: Uint8Array;
    with_update_sections: Uint8Array;
    linearized_with_object_streams: Uint8Array;
    with_large_page_count: Uint8Array;
    with_missing_endstream_eol_and_polluted_ctm: Uint8Array;
  };
}

export type ITestKernel = (assets: ITestAssets) => Uint8Array;

export interface ITest {
  kernel: ITestKernel;
  description: string;
  checklist: string[];
}
