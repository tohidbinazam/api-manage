// get elements
const skill = document.getElementById('skill');
const role = document.getElementById('role');
const devsList = document.getElementById('devsList');
const addNewDevs = document.getElementById('addNewDevs');
const devName = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const photo = document.getElementById('photo');

const getapidata = (api, element) => {
  axios.get(`http://localhost:5050/${api}`).then((res) => {
    res.data.map((data) => {
      element.innerHTML += `<option value="${data.id}"> ${data.name} </option>`;
    });
  });
};

getapidata('skills', skill);
getapidata('roles', role);

// Get All Developers
const getDevelopers = () => {
  devsList.innerHTML = '';
  axios.get(`http://localhost:5050/developers`).then((res) => {
    res.data.map((data, index) => {
      devsList.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.name}</td>
                    <td>${data.email}</td>
                    <td>${data.number}</td>
                    <td><img style="width: 40px; height: 40px;" src="${
                      data.photo
                    }" alt=""></td>
                    <td>
                    <a onclick="dataView(${
                      data.id
                    })" class="btn btn-info btn-sm" data-bs-toggle="modal" href="#viewModal"><i class="fa-solid fa-eye"></i> View</a>
                    <a onclick="dataEdit(${
                      data.id
                    })" class="btn btn-warning btn-sm" data-bs-toggle="modal" href="#editModal"><i class="fa-solid fa-pen-to-square"></i> Edit</a>
                    <a onclick="dataDelete(${
                      data.id
                    })" class="btn btn-danger btn-sm" data-bs-toggle="modal" href="#deleteModal"><i class="fa-regular fa-trash-can"></i> Delete</a>
                    </td>
                </tr>
            `;
    });
  });
};

getDevelopers();

// Add New Developer
addNewDevs.addEventListener('submit', function (e) {
  e.preventDefault();

  if (
    devName.value &&
    email.value &&
    phone.value &&
    photo.value &&
    skill.value &&
    role.value
  ) {
    axios
      .post(`http://localhost:5050/developers`, {
        id: '',
        name: devName.value,
        email: email.value,
        number: phone.value,
        photo: photo.value,
        skillId: skill.value,
        roleId: role.value,
      })
      .then((res) => {
        devName.value = '';
        email.value = '';
        phone.value = '';
        photo.value = '';
        skill.value = '';
        role.value = '';

        getDevelopers();
      });
  } else {
    alert('All fields are required !');
  }
});

// Dev edit Element
const devEdit = document.getElementById('devEdit');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const editPhone = document.getElementById('editPhone');
const editPhoto = document.getElementById('editPhoto');
const editSkill = document.getElementById('editSkill');
const editRole = document.getElementById('editRole');
const preview = document.getElementById('preview');

// Dev edit
let editId;
const dataEdit = (id) => {
  editId = id;
  axios.get(`http://localhost:5050/developers/${id}`).then((res) => {
    editName.value = res.data.name;
    editEmail.value = res.data.email;
    editPhone.value = res.data.number;
    editPhoto.value = res.data.photo;
    getapidata('skills', editSkill);
    getapidata('roles', editRole);
    preview.setAttribute('src', res.data.photo);
  });
};

devEdit.addEventListener('submit', function (e) {
  e.preventDefault();

  axios
    .patch(`http://localhost:5050/developers/${editId}`, {
      id: '',
      name: editName.value,
      email: editEmail.value,
      number: editPhone.value,
      photo: editPhoto.value,
      skillId: editSkill.value,
      roleId: editRole.value,
    })
    .then((res) => {
      getDevelopers();
    });
});

/**
 * Dev Delete
 */
const delDev = document.querySelector('.delDev');

const dataDelete = (id) => {
  delDev.addEventListener('click', function () {
    axios.delete(`http://localhost:5050/developers/${id}`).then((res) => {
      getDevelopers();
    });
  });
};

/**
 * Get Skill Name
 * Don't working
 * @param {*} id
 */
const getSkillName = (id) => {
  axios.get(`http://localhost:5050/skills/${id}`).then((res) => {
    return res.data.name;
  });
};

/**
 * Dev Data Single View
 */
const singleData = document.querySelector('.singleData');

const dataView = (id) => {
  singleData.innerHTML = '';
  axios.get(`http://localhost:5050/developers/${id}`).then((res) => {
    axios
      .get(`http://localhost:5050/skills/${res.data.skillId}`)
      .then((skill) => {
        axios
          .get(`http://localhost:5050/roles/${res.data.roleId}`)
          .then((role) => {
            singleData.innerHTML = `
                    <div class="row">
                        <div class="col-xl-6">
                            <img class="border border-5 shadow-lg border-white w-100" src="${res.data.photo}" alt="">
                        </div>
                        <div class="col-xl-6 text-break">
                            <h6>Name : ${res.data.name}</h6><hr>
                            <h6>Email : ${res.data.email}</h6><hr>
                            <h6>Number : ${res.data.number}</h6><hr>
                            <h6>Skill : ${skill.data.name}</h6><hr>
                            <h6>Role : ${role.data.name}</h6>
                        </div>
                    </div>
                `;
          });
      });
  });
};
