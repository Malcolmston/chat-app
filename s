class Admin {
  constructor(){
    this.admin = admin
  }

  async addMember(username, password, id){
    return(await User.create({
      username:username,
      password:password,
      pspId:id
    }))
  }

  async removeMember(username, password, id){
    return (await User.delete({where: {
      [Op.and]: [{username:username}, {password:password}, {pspId:id}]
    }}))
  }

  

  

}

/*
let a = new Admin()
a.addMember('Malcolm', 'Mal33a&', "malC44$")
*/