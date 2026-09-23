import * as yup from 'yup'

const urlSchema = yup
  .string()
  .trim()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL')

export const validateFeedUrl = (url, feeds) => urlSchema.validate(url).then((validUrl) => {
  if (feeds.includes(validUrl)) {
    return Promise.reject(new yup.ValidationError('RSS уже существует'))
  }

  return validUrl
})
