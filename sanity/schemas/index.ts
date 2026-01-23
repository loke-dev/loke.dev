import aboutPage from './aboutPage'
import blogPage from './blogPage'
import callout from './callout'
import code from './code'
import contactPage from './contactPage'
import homePage from './homePage'
import post from './post'
import project from './project'
import projectsPage from './projectsPage'

export const schemaTypes = [
  // Content types
  post,
  project,
  // Page singletons
  homePage,
  aboutPage,
  blogPage,
  projectsPage,
  contactPage,
  // Block types
  code,
  callout,
]
