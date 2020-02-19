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
    case 'information':
      return {
        pageContent: data,
        title: data.title[0].text,
      }
    case 'page':
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
        pageContent: data.data,
        pageId: data.id,
        title: data.data.title[0].text,
      }
    case 'projects':
      return {
        pageContent: data,
        title: data.title[0].text,
      }
    case 'projects_single':
      return {
        pageContent: data,
        slices: data.body,
        title: data.title[0].text,
      }
    case 'tags':
      return {
        pageContent: data,
        title: 'Tags bro',
      }
    case 'tag':
      return {
        pageContent: data,
      }
  }
}
