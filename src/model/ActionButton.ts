export class ActionButton {
   label: string = ''
   icon: string = ''
   click: () => void = () => {}
   disable: boolean = false

   constructor(label?: string, icon?: string, click?: () => void, disable?: boolean) {
      this.label = label ?? ''
      this.icon = icon ?? ''
      this.click = click ?? (() => {})
      this.disable = disable ?? false
   }
}
