const table = {
  state: {
    tableHeight: 0
  },
  mutations: {
    SET_TABLEHEIGHT: (state, height) => {
      state.tableHeight = height - 180
    }
  }
}

export default table
