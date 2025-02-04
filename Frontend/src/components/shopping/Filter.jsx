import React, { Fragment } from 'react'
import { filterOptions } from '../config'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

const FilterProduct = ({filter,handleFilter}) => {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
       <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold'>Fliters</h2>
       </div>
<div className='p-4 space-y-3'>
    {
        Object.keys(filterOptions).map(keyItem=><Fragment>
            <div>
                <h3 className='text-basee font-medium'>{keyItem}</h3>
                <div className='grid gap-2 mt-2'> {
                    filterOptions[keyItem].map(option=><Label className='flex items-center gap-2 '>
                        <Checkbox checked={
                            filter && Object.keys(filter).length>0 && filter[keyItem] && filter[keyItem].indexOf(option.id)>-1
                        } onCheckedChange={()=>handleFilter(keyItem,option.id)}/>
                        {option.label}
                    </Label>)
                }</div>
            </div>
            <Separator/>
        </Fragment>)
    }
</div>
    </div>
  )
}

export default FilterProduct