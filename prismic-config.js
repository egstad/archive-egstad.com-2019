import Prismic from 'prismic-javascript'

export const prismicConfig = {
  baseUrl: 'https://egstad.cdn.prismic.io/api/v2',
}

export const initApi = req => {
  return Prismic.getApi(prismicConfig.baseUrl, {
    req,
  })
}

export const generatePageData = (documentType, data) => {
  switch (documentType) {
    case 'home':
      return {
        pageContent: data,
        title: data.title[0].text,
      }
    case 'pieces':
      return {
        pageContent: data,
        title: data.title[0].text,
      }
    case 'pieces_single':
      return {
        pieces: data,
        title: data.title[0].text,
      }
  }
}
