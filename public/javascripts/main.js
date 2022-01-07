let socket = io();
socket.on("connect", () => {});
socket.on("disconnect", () => {});

const arePushPost = new Vue({
  el: ".area-push-post",
  data: {
    handleCloseYtb: false,
    text_youtube: "",
    text_content: "",
    listImages: [],
  },

  methods: {
    choiceImages() {
      let loadImage = document.getElementById("form-images");
      loadImage.click();
      loadImage.addEventListener("change", this.getContentImages, false);
    },
    getContentImages(e) {
      const file_target = e.target.files[0];
      if (file_target != null) {
        this.listImages = e.target.files;
      }
    },
    async pushPost() {
      let textIfYtb = "";
      if (this.text_youtube.trim() != "") {
        let url = new URL(this.text_youtube.trim());
        let paramUrl = url.searchParams.get("v");
        let linkEmbeb = "https://www.youtube.com/embed/";
        textIfYtb = `${linkEmbeb}${paramUrl}`;
      }
      let data = new FormData();
      for (let i = 0; i < this.listImages.length; i++) {
        data.append("images", this.listImages[i], this.listImages[i].name);
      }
      data.append("content", this.text_content);
      data.append("youtube", textIfYtb);
      this.handleCloseYtb = false;
      this.text_youtube = "";
      this.text_content = "";
      this.listImages = [];
      const listNewPost = await axios.post("/post", data);
      listPostCurr._data.listPost.unshift(listNewPost.data);
    },
  },
});
const listPostCurr = new Vue({
  el: ".content-post",
  data: {
    listPost: [],
    showDialogEdit: false,
    indexPostTargetedEdit: -1,
    textEditContent: "",
    textEditYtb: "",
    listImagesEdit: [],
    isDeleteImg: false,
    idPostTargetedEdit: -1,
    isBool: false,
    count: 0,
  },

  async created() {
    const handleScroll = this.handleScrollLastPage;
    const listPost = await this.getPostServer();
    this.listPost = listPost;
    window.addEventListener("scroll", handleScroll);
  },

  updated() {
    setTooltip();
  },
  watch: {
    async isBool(isCheck) {
      if (isCheck == true) {
        const listPost = await this.getPostServer();

        listPost.length != 0
          ? (this.listPost = [...this.listPost, ...listPost] && this.count++)
          : console.log("Failed");
        this.isBool = false;
      }
    },
  },

  methods: {
    async getPostServer() {
      const splitUser = window.location.search.split("=");
      const idUser = splitUser.slice(-1)[0];
      let listPost = [];
      if (!idUser) {
        listPost = await axios.get("/post", {
          params: {
            turn: this.count,
          },
        });
      } else {
        listPost = await axios.get("/post", {
          params: {
            idUser: idUser,
            turn: this.count,
          },
        });
      }

      return [...listPost.data];
    },
    handleScrollLastPage(e) {},
    openComment(post_Id) {
      let state = document.getElementById("comment-area" + post_Id).style
        .display;
      document.getElementById("comment-area" + post_Id).style.display =
        state == "" || state == "none" ? "block" : "none";
    },

    handleCommentPost(idPostCmt, idUserCmt, indexPostCmt) {
      let targetInput = document.getElementById(
        "input-comment-form" + idPostCmt
      ).value;
      const contentSend = targetInput.trim();
      document.getElementById("input-comment-form" + idPostCmt).value = "";
      axios
        .post("/comment", {
          message: contentSend,
          idOwner: idUserCmt,
          idPostCmt,
        })
        .then((res) => {
          const listNewComment = res.data;
          this.listPost[indexPostCmt].listComment.push(listNewComment);
        });
    },
    deleteComment(idComment, idUser, indexPost, indexComment) {
      axios.delete("/comment", {
        params: {
          idComment,
          idUser,
        },
      });
      this.listPost[indexPost].listComment = [
        ...this.listPost[indexPost].listComment.slice(0, indexComment),
        ...this.listPost[indexPost].listComment.slice(indexComment + 1),
      ];
    },
    handleReactHeart(idUserReact, indexPostReact, idPostReact) {
      axios.post("/post/heart", {
        idUserReact,
        idPostReact,
      });
      const indexUserReact =
        this.listPost[indexPostReact].heart.indexOf(idUserReact);
      indexUserReact != -1
        ? (this.listPost[indexPostReact].heart = [
            ...this.listPost[indexPostReact].heart.slice(0, indexUserReact),
            ...this.listPost[indexPostReact].heart.slice(indexUserReact + 1),
          ])
        : this.listPost[indexPostReact].heart.push(idUserReact);
    },
    handleCheckRecHeart(idUserRec, indexPostRec) {
      const indexUserRec = this.listPost[indexPostRec].heart.indexOf(idUserRec);
      return indexUserRec != -1 ? true : false;
    },
    handleOpenDialogEdit(indexPostEdit, idPostEdit) {
      indexPostEdit == this.indexPostTargetedEdit ||
      this.indexPostTargetedEdit == -1
        ? (this.showDialogEdit = !this.showDialogEdit)
        : console.log("Failed");
      this.indexPostTargetedEdit = indexPostEdit;
      this.idPostTargetedEdit = idPostEdit;
      this.textEditContent = this.listPost[indexPostEdit].content;
    },
    handleEditImages() {
      const getElementInput = document.getElementById("input-images-edit");
      getElementInput.click();
      getElementInput.addEventListener(
        "change",
        this.handleGetEditImages,
        false
      );
    },
    handleGetEditImages(e) {
      e.target.files[0] != null
        ? (this.listImagesEdit = e.target.files)
        : console.log("Failed");
    },
    async handlePushPostEdit() {
      let infoYtbIframe = "";
      if (this.textEditYtb.trim() != "") {
        let url = new URL(this.textEditYtb.trim());
        let paramUrl = url.searchParams.get("v");
        let urlEmbeb = "https://www.youtube.com/embed/";
        infoYtbIframe = `${urlEmbeb}${paramUrl}`;
      }
      let data = new FormData();
      for (let i = 0; i < this.listImagesEdit.length; i++) {
        data.append(
          "images",
          this.listImagesEdit[i],
          this.listImagesEdit[i].name
        );
      }
      data.append("content", this.textEditContent);
      data.append("youtube", infoYtbIframe);
      data.append("deleteImages", this.isDeleteImg);
      data.append("idPost", this.idPostTargetedEdit);

      const listNewEditPost = await axios.patch("/post", data);

      this.listPost[this.indexPostTargetedEdit] = listNewEditPost.data;
      this.showDialogEdit = false;
      this.textEditContent = "";
      this.textEditYtb = "";
      this.indexPostTargetedEdit = -1;
      this.idPostTargetedEdit = -1;
      this.listImagesEdit = [];
      this.isDeleteImg = false;
    },
    handleDeletePost(indexPostDel, idPostDel) {
      axios.delete("/post", {
        params: {
          idPostDel,
        },
      });
      this.listPost.splice(indexPostDel, 1);
    },
    handleCheckPermission(idLogIn, idPermission) {
      return idLogIn == idPermission ? true : false;
    },
  },
});

const listInform = new Vue({
  el: ".information-list",
  data: {
    key: "",
  },
  methods: {
    handleSelectType(event) {
      this.currentTypeTopic = event.target.value;
      if (event.target.value != "") {
        window.location.href = "/inform?type=" + event.target.value;
      } else {
        window.location.href = "/inform";
      }
    },
  },
});

const informationUserEdit = new Vue({
  el: ".areachangeavt",
  methods: {
    handleDialogAvatar() {
      let getElementAvt = document.getElementById("avatar-input");
      getElementAvt.click();
      getElementAvt.addEventListener("change", this.handleEditAvatar, false);
    },
    handleEditAvatar(e) {
      if (e.target.files[0] != null) {
        document.getElementById("avatar-form").submit();
      }
    },
  },
});

function setTooltip() {
  console.log($('[data-toggle="tooltip"]'));
  $('[data-toggle="tooltip"]').tooltip();
}
