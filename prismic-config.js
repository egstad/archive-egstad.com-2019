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
        // projects content is the first item in the page content array
        pageContent: data[0].results,
        // project single content is the second item in the page content array
        pieces: data[1].results,
        title: data[0].results.title[0].text,
      }
    case 'pieces_single':
      return {
        pageContent: data,
        title: data.title[0].text,
      }
    case 'projects':
      return {
        // projects content is the first item in the page content array
        pageContent: data[0].results,
        // project single content is the second item in the page content array
        projects: data[1].results,
        title: data[0].results.title[0].text,
      }
    case 'projects_single':
      return {
        pageContent: data,
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
