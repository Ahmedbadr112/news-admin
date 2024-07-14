export interface INews{
    newsAction : number
    sectionId : number
    CatId : number
    NewsType : number
    Title : string
    SubTitle : string
    Story : string
    Brief : string
    Tags : string[]
    image1Id : number
    image2Id : number
    PictureCaption1 : string
    PicCaption2 : string
    ByLine : string
    Notes : string
    ChkNewsTicker : boolean
    ChkTopNews : boolean
    ChkTopNewCategory : boolean
    ChkReadNow : boolean
    ChkImportantNews : boolean
    ChkFilesNews : boolean
    ChkTopNewSection : boolean
    PublishDate : Date
}