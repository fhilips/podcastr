import { GetStaticProps } from "next";
import { Header } from "../components/Header";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;  
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;  
  url: string;  
  publishedAt: string;  
  

}
type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <Header/>
      <h1>index</h1>
      <p>{JSON.stringify(props.episodes)}</p>

    </div>  
  )
}
export const getStaticProps: GetStaticProps = async () =>{
  const { data } = await api.get('episodes?',{
    params: {
      _limit: 12,
      _sort: 'published',
      _order: 'desc',
      
    }
  })

  const episodes = data.map(episode => {
    return { 
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      numbers: episode.numbers,
      member: episode.member,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}, ),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    };
  })

  return{ 
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,

  }
}