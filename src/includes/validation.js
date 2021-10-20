import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  max_value as maxValue,
  min_value as minValue,
  numeric,
  confirmed,
  not_one_of as exclude,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);
    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('numeric', numeric);
    defineRule('password_mismatch', confirmed);
    defineRule('exclude', exclude);
    defineRule('country_excluded', exclude);
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field ${ctx.field} is too short.`,
          max: `This field ${ctx.field} is too long.`,
          alpha_spaces: `This field ${ctx.field} may only contain alphabitical charecters and spaces.`,
          email: `This field ${ctx.field} must be a valid email.`,
          min_value: `This field ${ctx.field} is too low`,
          max_value: `This field ${ctx.field} is too high`,
          exclude: `You are not allowed to use this value for the field ${ctx.field}`,
          country_excluded: `Due to the restrictions, we do not accept users from this locations.`,
          password_mismatch: `The password do not match`,
          tos: `You must accept the Term of Service`,
        };
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `This field ${ctx.field} is invalid.`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
