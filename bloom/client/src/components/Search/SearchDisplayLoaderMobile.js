import React from "react"
import ContentLoader from "react-content-loader" 

const SearchDisplayMobileLoader = props => (
  <ContentLoader 
    speed={2}
    width={'100%'}
    height={'100%'}
    viewBox="0 0 600 1300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="5" y="20" rx="0" ry="0" width="222" height="50" /> 
    <rect x="5" y="103" rx="0" ry="0" width="5" height="800" /> 
    <rect x="5" y="103" rx="0" ry="0" width="580" height="5" /> 
    <rect x="585" y="103" rx="0" ry="0" width="5" height="800" /> 
    <rect x="5" y="900" rx="0" ry="0" width="580" height="5" /> 
    <rect x="5" y="103" rx="0" ry="0" width="580" height="450" /> 
    <rect x="55" y="603" rx="0" ry="0" width="480" height="40" /> 
    <rect x="55" y="663" rx="0" ry="0" width="480" height="20" /> 
    <rect x="70" y="703" rx="0" ry="0" width="450" height="20" /> 
    <rect x="55" y="743" rx="0" ry="0" width="480" height="20" /> 
    <rect x="250" y="803" rx="0" ry="0" width="100" height="50" /> 

  </ContentLoader>
)

export default SearchDisplayMobileLoader