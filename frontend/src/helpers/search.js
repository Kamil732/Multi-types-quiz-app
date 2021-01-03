import queryString from 'query-string'

const search = (props, key, value) => {
   const query = queryString.parse(props.location.search);
   delete query['page']

   const modifiedQuery = {
      ...query,
      [key]: value,
   }


   props.history.replace({
      pathname: props.location.pathname,
      search: queryString.stringify(modifiedQuery)
   })
}

export default search