import React from "react"
import ContentLoader from "react-content-loader" 

const UserStoresDashboardLoader = () => (
  <ContentLoader 
    speed={1}
    style={{ width: '100%', height: '100%' }}
    viewBox="0 0 1000 1500"
    backgroundColor="#f3f3f3"
    foregroundColor="#eae8e8"
  >
    <rect className={'d-none d-md-block'} x="50" y="30" rx="0" ry="0" width="500" height="250" /> 
    <rect className={'d-none d-md-block'} x="630" y="71" rx="3" ry="3" width="200" height="15" /> 
    <rect className={'d-none d-md-block'} x="645" y="105" rx="3" ry="3" width="164" height="6" /> 
    <rect className={'d-none d-md-block'} x="630" y="130" rx="3" ry="3" width="200" height="25" /> 
    <rect className={'d-none d-md-block'} x="630" y="170" rx="3" ry="3" width="200" height="25" /> 
    <rect className={'d-none d-md-block'} x="630" y="210" rx="3" ry="3" width="200" height="25" /> 
    
    <rect className={'d-block d-md-none'} x="66" y="0" rx="0" ry="0" width="858" height="614" /> 
    <rect className={'d-block d-md-none'}x="69" y="689" rx="3" ry="3" width="858" height="115" /> 
    <rect className={'d-block d-md-none'}x="104" y="869" rx="3" ry="3" width="788" height="55" /> 
    <rect className={'d-block d-md-none'}x="49" y="999" rx="3" ry="3" width="900" height="115" /> 
    <rect className={'d-block d-md-none'}x="49" y="1169" rx="3" ry="3" width="900" height="115" /> 
    <rect className={'d-block d-md-none'}x="49" y="1339" rx="3" ry="3" width="900" height="115" /> 
  </ContentLoader>
)

export default UserStoresDashboardLoader