
  import { defaultSubThemes, defaultComponentThemes } from '@tamagui/themes/v3-themes'
  import { createThemeBuilder } from '@tamagui/theme-builder'

  const palettes = {
    
        "light": ['hsla(50, 54%, 70%, 1)','hsla(120, 20%, 99%, 0)','hsla(120, 20%, 99%, 0.25)','hsla(120, 20%, 99%, 0.5)','hsla(120, 20%, 99%, 0.75)','hsla(116, 23%, 99%, 1)','hsla(116, 23%, 93%, 1)','hsla(116, 23%, 88%, 1)','hsla(116, 23%, 82%, 1)','hsla(116, 23%, 77%, 1)','hsla(116, 23%, 72%, 1)','hsla(116, 23%, 66%, 1)','hsla(116, 23%, 61%, 1)','hsla(116, 23%, 55%, 1)','hsla(116, 23%, 50%, 1)','hsla(0, 15%, 15%, 1)','hsla(0, 15%, 10%, 1)','hsla(0, 14%, 10%, 0.75)','hsla(0, 14%, 10%, 0.5)','hsla(0, 14%, 10%, 0.25)','hsla(0, 14%, 10%, 0)','hsla(50, 54%, 66%, 1)']
      ,
        "dark": ['hsla(50, 54%, 58%, 1)','hsla(116, 23%, 24%, 0)','hsla(116, 23%, 24%, 0.25)','hsla(116, 23%, 24%, 0.5)','hsla(116, 23%, 24%, 0.75)','hsla(116, 23%, 24%, 1)','hsla(116, 23%, 27%, 1)','hsla(116, 23%, 30%, 1)','hsla(116, 23%, 33%, 1)','hsla(116, 23%, 36%, 1)','hsla(116, 23%, 39%, 1)','hsla(116, 23%, 41%, 1)','hsla(116, 23%, 44%, 1)','hsla(116, 23%, 47%, 1)','hsla(116, 23%, 50%, 1)','hsla(0, 15%, 93%, 1)','hsla(0, 15%, 95%, 1)','hsla(0, 15%, 95%, 0.75)','hsla(0, 15%, 95%, 0.5)','hsla(0, 15%, 95%, 0.25)','hsla(0, 15%, 95%, 0)','hsla(50, 54%, 47%, 1)']
      ,
        "light_accent": ['hsla(116, 23%, 82%, 1)','hsla(50, 54%, 72%, 0)','hsla(50, 54%, 72%, 0.25)','hsla(50, 54%, 72%, 0.5)','hsla(50, 54%, 72%, 0.75)','hsla(50, 54%, 72%, 1)','hsla(50, 54%, 71%, 1)','hsla(50, 54%, 70%, 1)','hsla(50, 54%, 70%, 1)','hsla(50, 54%, 69%, 1)','hsla(50, 54%, 68%, 1)','hsla(50, 54%, 67%, 1)','hsla(50, 54%, 67%, 1)','hsla(50, 54%, 66%, 1)','hsla(50, 54%, 65%, 1)','hsla(250, 50%, 95%, 1)','hsla(250, 50%, 95%, 1)','hsla(249, 52%, 95%, 0.75)','hsla(249, 52%, 95%, 0.5)','hsla(249, 52%, 95%, 0.25)','hsla(249, 52%, 95%, 0)','hsla(116, 23%, 55%, 1)']
      ,
        "dark_accent": ['hsla(116, 23%, 47%, 1)','hsla(50, 54%, 40%, 0)','hsla(50, 54%, 40%, 0.25)','hsla(50, 54%, 40%, 0.5)','hsla(50, 54%, 40%, 0.75)','hsla(50, 54%, 40%, 1)','hsla(50, 54%, 42%, 1)','hsla(50, 54%, 44%, 1)','hsla(50, 54%, 47%, 1)','hsla(50, 54%, 49%, 1)','hsla(50, 54%, 51%, 1)','hsla(50, 54%, 53%, 1)','hsla(50, 54%, 56%, 1)','hsla(50, 54%, 58%, 1)','hsla(50, 54%, 60%, 1)','hsla(250, 50%, 90%, 1)','hsla(250, 50%, 95%, 1)','hsla(249, 52%, 95%, 0.75)','hsla(249, 52%, 95%, 0.5)','hsla(249, 52%, 95%, 0.25)','hsla(249, 52%, 95%, 0)','hsla(116, 23%, 33%, 1)']
      
  }
  const templates = {
    
        "light_base": {"accentBackground":0,"accentColor":0,"background0":1,"background025":2,"background05":3,"background075":4,"color1":5,"color2":6,"color3":7,"color4":8,"color5":9,"color6":10,"color7":11,"color8":12,"color9":13,"color10":14,"color11":15,"color12":16,"color0":-1,"color025":-2,"color05":-3,"color075":-4,"background":5,"backgroundHover":4,"backgroundPress":6,"backgroundFocus":6,"borderColor":8,"borderColorHover":7,"borderColorPress":9,"borderColorFocus":8,"color":-5,"colorHover":-6,"colorPress":-5,"colorFocus":-6,"colorTransparent":-1,"placeholderColor":-8,"outlineColor":-2}
      ,
        "light_alt1": {"color":-6,"colorHover":-7,"colorPress":-6,"colorFocus":-7}
      ,
        "light_alt2": {"color":-7,"colorHover":-8,"colorPress":-7,"colorFocus":-8}
      ,
        "light_surface1": {"background":6,"backgroundHover":5,"backgroundPress":7,"backgroundFocus":7,"borderColor":9,"borderColorHover":8,"borderColorFocus":9,"borderColorPress":10}
      ,
        "light_surface2": {"background":7,"backgroundHover":6,"backgroundPress":8,"backgroundFocus":8,"borderColor":10,"borderColorHover":9,"borderColorFocus":10,"borderColorPress":11}
      ,
        "light_surface3": {"background":8,"backgroundHover":7,"backgroundPress":9,"backgroundFocus":9,"borderColor":11,"borderColorHover":10,"borderColorFocus":11,"borderColorPress":12}
      ,
        "light_inverseSurface1": {"color":6,"colorHover":5,"colorPress":7,"colorFocus":7,"background":-5,"backgroundHover":-6,"backgroundPress":-5,"backgroundFocus":-6,"borderColor":-7,"borderColorHover":-8,"borderColorFocus":-9,"borderColorPress":-10}
      ,
        "light_inverseActive": {"color":6,"colorHover":5,"colorPress":7,"colorFocus":7,"background":-7,"backgroundHover":-8,"backgroundPress":-7,"backgroundFocus":-8,"borderColor":-9,"borderColorHover":-10,"borderColorFocus":-11,"borderColorPress":-12}
      ,
        "light_surfaceActive": {"background":10,"backgroundHover":10,"backgroundPress":11,"backgroundFocus":11,"borderColor":10,"borderColorHover":10,"borderColorFocus":11,"borderColorPress":11}
      ,
        "dark_base": {"accentBackground":0,"accentColor":0,"background0":1,"background025":2,"background05":3,"background075":4,"color1":5,"color2":6,"color3":7,"color4":8,"color5":9,"color6":10,"color7":11,"color8":12,"color9":13,"color10":14,"color11":15,"color12":16,"color0":-1,"color025":-2,"color05":-3,"color075":-4,"background":5,"backgroundHover":6,"backgroundPress":4,"backgroundFocus":4,"borderColor":8,"borderColorHover":9,"borderColorPress":7,"borderColorFocus":8,"color":-5,"colorHover":-6,"colorPress":-5,"colorFocus":-6,"colorTransparent":-1,"placeholderColor":-8,"outlineColor":-2}
      ,
        "dark_alt1": {"color":-6,"colorHover":-7,"colorPress":-6,"colorFocus":-7}
      ,
        "dark_alt2": {"color":-7,"colorHover":-8,"colorPress":-7,"colorFocus":-8}
      ,
        "dark_surface1": {"background":6,"backgroundHover":7,"backgroundPress":5,"backgroundFocus":5,"borderColor":9,"borderColorHover":10,"borderColorFocus":9,"borderColorPress":8}
      ,
        "dark_surface2": {"background":7,"backgroundHover":8,"backgroundPress":6,"backgroundFocus":6,"borderColor":10,"borderColorHover":11,"borderColorFocus":10,"borderColorPress":9}
      ,
        "dark_surface3": {"background":8,"backgroundHover":9,"backgroundPress":7,"backgroundFocus":7,"borderColor":11,"borderColorHover":12,"borderColorFocus":11,"borderColorPress":10}
      ,
        "dark_inverseSurface1": {"color":6,"colorHover":7,"colorPress":5,"colorFocus":5,"background":-5,"backgroundHover":-6,"backgroundPress":-5,"backgroundFocus":-6,"borderColor":-7,"borderColorHover":-8,"borderColorFocus":-9,"borderColorPress":-10}
      ,
        "dark_inverseActive": {"color":6,"colorHover":7,"colorPress":5,"colorFocus":5,"background":-7,"backgroundHover":-8,"backgroundPress":-7,"backgroundFocus":-8,"borderColor":-9,"borderColorHover":-10,"borderColorFocus":-11,"borderColorPress":-12}
      ,
        "dark_surfaceActive": {"background":10,"backgroundHover":10,"backgroundPress":9,"backgroundFocus":9,"borderColor":10,"borderColorHover":10,"borderColorFocus":9,"borderColorPress":9}
      
  }

  export const themes = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light',
      },
      dark: {
        template: 'base',
        palette: 'dark',
      },
    })
    .addChildThemes(
      palettes.light_accent
        ? {
            accent: [
              {
                parent: 'light',
                template: 'base',
                palette: 'light_accent',
              },
              {
                parent: 'dark',
                template: 'base',
                palette: 'dark_accent',
              },
            ],
          }
        : {}
    )
    .addChildThemes(defaultSubThemes)
    .addChildThemes(defaultComponentThemes, {
      avoidNestingWithin: [
        'alt1',
        'alt2',
        'surface1',
        'surface2',
        'surface3',
        'surface4',
        'active',
      ],
    })

    .build()
