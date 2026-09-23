import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
  string: {
    url: 'errors.url',
  },
})

const urlSchema = yup.string().trim().required().url()

export const validateFeedUrl = (url, feeds) => urlSchema.validate(url).then((validUrl) => {
  if (feeds.includes(validUrl)) {
    return Promise.reject(new yup.ValidationError('errors.duplicate'))
  }

  return validUrl
})
