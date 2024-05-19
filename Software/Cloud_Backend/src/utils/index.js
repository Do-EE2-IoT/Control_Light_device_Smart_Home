import _ from "lodash"

const getInfoData = ({ object, fields = [] }) => {
    return _.pick(object, fields)
}
export default getInfoData