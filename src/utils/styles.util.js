/**
 * Function gets a styles module, returns a method that sends back a styles string converted by the given module version.
 * @param Module the module to convert the styles string with
 * @returns a method which receives a styles-string (seperated with whitespaces) and returns their module version
 */
export function GetModuleStylesGetter(Module) {
    return function (styles) {
        return styles
            .split(' ')
            .map(style => Module[style])
            .join(' ')
    }
}
