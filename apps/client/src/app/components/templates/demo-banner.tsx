import { Card, CardContent } from "@components/ui/card"

export default function DemoBanner() {
  return (
    <div className="w-11/12 mx-auto mb-10 mt-28 h-[35rem]">
      <div className="relative h-96">
        <Card className="w-1/2 absolute top-5 left-1/4 z-50 p-0">
          <CardContent className="p-0 object-fill">
            <img src="assets/demo-1.png" className="object-fill w-full"  />
          </CardContent>
        </Card>
        <Card className="w-[40%] absolute top-1/2 left-0 z-30 p-0">
          <CardContent className="p-0">
            <img src="assets/demo-2.png" />
          </CardContent>
        </Card>
        <Card className="w-[40%] absolute top-1/2 right-0 z-20 p-0">
          <CardContent className="p-0">
            <img src="assets/demo-3.png" />
          </CardContent>
        </Card>
      </div>
    </div>
   
  )
}