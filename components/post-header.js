import PostTitle from '../components/post-title'
import CoverImage from './cover-image'
import DateFormatter from './date-formatter'


export default function PostHeader({ title, coverImage, date, link }) {
    return (
      <>
        
        <PostTitle>{title}</PostTitle>
        
        <div className="hidden md:block md:mb-12">
        </div>
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={title} src={coverImage} height={820} width={1240} />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="block md:hidden mb-6">
          </div>
          <div className="mb-6 text-lg">
            <DateFormatter dateString={date} />
          </div>
          <div>
            <p>{link}</p>
          </div>
        </div>
      </>
    )
  }